"use client";
import { useRouter } from "next/navigation";
import Pusher, { Members, PresenceChannel } from "pusher-js";
import { useEffect, useRef, useState } from "react";

interface Props {
    userName: string;
    roomName: string;
}

const ICE_SERVERS = {
    // you can add TURN servers here too
    iceServers: [
        {
            urls: "stun:openrelay.metered.ca:80",
        },
        {
            urls: "stun:stun.l.google.com:19302",
        },
        {
            urls: "stun:stun2.l.google.com:19302",
        },
    ],
};

export default function Room({ userName, roomName }: Props) {
    const [micActive, setMicActive] = useState(true);
    const [cameraActive, setCameraActive] = useState(true);

    const router = useRouter();

    const host = useRef(false);
    // Pusher specific refs
    const pusherRef = useRef<Pusher>();
    const channelRef = useRef<PresenceChannel>();

    // Webrtc refs
    const rtcConnection = useRef<RTCPeerConnection | null>();
    const userStream = useRef<MediaStream>();

    const userVideo = useRef<HTMLVideoElement>(null);
    const partnerVideo = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            authEndpoint: "/api/pusher/auth",
            auth: {
                params: { username: userName },
            },
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });
        channelRef.current = pusherRef.current.subscribe(
            `presence-${roomName}`
        ) as PresenceChannel;
        // when a users subscribe
        channelRef.current.bind(
            "pusher:subscription_succeeded",
            (members: Members) => {
                console.log(members);
                if (members.count === 1) {
                    // when subscribing, if you are the first member, you are the host
                    host.current = true;
                }

                // example only supports 2 users per call
                // if (members.count > 2) {
                //     // 3+ person joining will get sent back home
                //     // Can handle this however you'd like
                //     router.push("/");
                // }
                handleRoomJoined();
            }
        );

        // when a member leaves the chat
        channelRef.current.bind("pusher:member_removed", () => {
            handlePeerLeaving();
        });

        channelRef.current.bind(
            "client-offer",
            (offer: RTCSessionDescriptionInit) => {
                // offer is sent by the host, so only non-host should handle it
                if (!host.current) {
                    handleReceivedOffer(offer);
                }
            }
        );

        // When the second peer tells host they are ready to start the call
        // This happens after the second peer has grabbed their media
        channelRef.current.bind("client-ready", () => {
            initiateCall();
        });

        channelRef.current.bind(
            "client-answer",
            (answer: RTCSessionDescriptionInit) => {
                // answer is sent by non-host, so only host should handle it
                if (host.current) {
                    handleAnswerReceived(answer as RTCSessionDescriptionInit);
                }
            }
        );

        channelRef.current.bind(
            "client-ice-candidate",
            (iceCandidate: RTCIceCandidate) => {
                // answer is sent by non-host, so only host should handle it
                handlerNewIceCandidateMsg(iceCandidate);
            }
        );

        return () => {
            if (pusherRef.current)
                pusherRef.current.unsubscribe(`presence-${roomName}`);
        };
    }, [userName, roomName]);

    const handleRoomJoined = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 1280, height: 720 },
            })
            .then((stream) => {
                /* store reference to the stream and provide it to the video element */
                userStream.current = stream;
                userVideo.current!.srcObject = stream;
                userVideo.current!.onloadedmetadata = () => {
                    userVideo.current!.play();
                };
                if (!host.current) {
                    // the 2nd peer joining will tell to host they are ready
                    channelRef.current!.trigger("client-ready", {});
                }
            })
            .catch((err) => {
                /* handle the error */
                console.log(err);
            });
    };

    const createPeerConnection = () => {
        // We create a RTC Peer Connection
        const connection = new RTCPeerConnection(ICE_SERVERS);

        // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
        connection.onicecandidate = handleICECandidateEvent;

        // We implement our onTrack method for when we receive tracks
        connection.ontrack = handleTrackEvent;
        connection.onicecandidateerror = (e) => console.log(e);
        return connection;
    };

    const initiateCall = () => {
        if (host.current) {
            rtcConnection.current = createPeerConnection();
            // Host creates offer
            userStream.current?.getTracks().forEach((track) => {
                rtcConnection.current?.addTrack(track, userStream.current!);
            });
            rtcConnection
                .current!.createOffer()
                .then((offer) => {
                    rtcConnection.current!.setLocalDescription(offer);
                    // 4. Send offer to other peer via pusher
                    // Note: 'client-' prefix means this event is not being sent directly from the client
                    // This options needs to be turned on in Pusher app settings
                    channelRef.current?.trigger("client-offer", offer);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
        rtcConnection.current = createPeerConnection();
        userStream.current?.getTracks().forEach((track) => {
            // Adding tracks to the RTCPeerConnection to give peer access to it
            rtcConnection.current?.addTrack(track, userStream.current!);
        });

        rtcConnection.current.setRemoteDescription(offer);
        rtcConnection.current
            .createAnswer()
            .then((answer) => {
                rtcConnection.current!.setLocalDescription(answer);
                channelRef.current?.trigger("client-answer", answer);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const handleAnswerReceived = (answer: RTCSessionDescriptionInit) => {
        rtcConnection
            .current!.setRemoteDescription(answer)
            .catch((error) => console.log(error));
    };

    const handleICECandidateEvent = async (
        event: RTCPeerConnectionIceEvent
    ) => {
        if (event.candidate) {
            // return sentToPusher('ice-candidate', event.candidate)
            channelRef.current?.trigger(
                "client-ice-candidate",
                event.candidate
            );
        }
    };

    const handlerNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
        // We cast the incoming candidate to RTCIceCandidate
        const candidate = new RTCIceCandidate(incoming);
        rtcConnection
            .current!.addIceCandidate(candidate)
            .catch((error) => console.log(error));
    };

    const handleTrackEvent = (event: RTCTrackEvent) => {
        partnerVideo.current!.srcObject = event.streams[0];
    };

    const toggleMediaStream = (type: "video" | "audio", state: boolean) => {
        userStream.current!.getTracks().forEach((track) => {
            if (track.kind === type) {
                track.enabled = !state;
            }
        });
    };

    const handlePeerLeaving = () => {
        host.current = true;
        if (partnerVideo.current?.srcObject) {
            (partnerVideo.current.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop()); // Stops receiving all track of Peer.
        }

        // Safely closes the existing connection established with the peer who left.
        if (rtcConnection.current) {
            rtcConnection.current.ontrack = null;
            rtcConnection.current.onicecandidate = null;
            rtcConnection.current.close();
            rtcConnection.current = null;
        }
    };

    const leaveRoom = () => {
        // socketRef.current.emit('leave', roomName); // Let's the server know that user has left the room.

        if (userVideo.current!.srcObject) {
            (userVideo.current!.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop()); // Stops sending all tracks of User.
        }
        if (partnerVideo.current!.srcObject) {
            (partnerVideo.current!.srcObject as MediaStream)
                .getTracks()
                .forEach((track) => track.stop()); // Stops receiving all tracks from Peer.
        }

        // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
        if (rtcConnection.current) {
            rtcConnection.current.ontrack = null;
            rtcConnection.current.onicecandidate = null;
            rtcConnection.current.close();
            rtcConnection.current = null;
        }

        router.push("/");
    };

    const toggleMic = () => {
        toggleMediaStream("audio", micActive);
        setMicActive((prev) => !prev);
    };

    const toggleCamera = () => {
        toggleMediaStream("video", cameraActive);
        setCameraActive((prev) => !prev);
    };

    return (
        <div>
            <div>
                <div>
                    <video autoPlay ref={userVideo} muted />
                    <div>
                        <button onClick={toggleMic} type="button">
                            {micActive ? "Mute Mic" : "UnMute Mic"}
                        </button>
                        <button onClick={leaveRoom} type="button">
                            Leave
                        </button>
                        <button onClick={toggleCamera} type="button">
                            {cameraActive ? "Stop Camera" : "Start Camera"}
                        </button>
                    </div>
                </div>
                <div>
                    <video autoPlay ref={partnerVideo} />
                </div>
            </div>
        </div>
    );
}
