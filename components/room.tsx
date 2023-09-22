'use client'
import io from 'socket.io-client'
import React, { useEffect } from "react"
const socket = io("http://localhost:8000")
const Room = ({ id }: { id: string }) => {
    useEffect(() => {
        socket.on("connect", () => {
            alert("conected");
        })
    }, [])
    return <>hi</>
}

export default Room;