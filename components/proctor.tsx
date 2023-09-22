"use client";

import ProctorAction from "@/actions/proctor-register";
import { Container, Text, Button, Flex } from "@chakra-ui/react";
import Nav from "./Navbar";
import { useRouter } from "next/navigation";
export default function Proctor({
    tests,
    registeredids,
}: {
    tests: any;
    registeredids: Set<any>;
}) {
    const router = useRouter();
    function TestCard({ id, description, start, end, registered }: { id: any, description: any, start: any, end: any, registered: any }) {
        const startD = new Date(start);

        return (<>
            <Container width="4xl" height="150px" bg="#f35151" mb={6} borderRadius={"10px"} padding={"20px"}>
                <Flex justifyContent={'space-between'} mb={5}>
                    <Text fontSize="2xl" as="b" textAlign={"left"}>{description.toUpperCase()}</Text>
                    <Text fontSize="2xl" as="b" textAlign={"right"}>{startD.getHours()}:{startD.getMinutes()}</Text>
                </Flex>
                <Flex justifyContent={"center"}>
                    <Button
                            onClick={async (e) => {
                                if (registeredids.has(id)) {
                                    router.push(`/test/${id}`);
                                }
                                else{
                                    const password = prompt("Enter Password") || "";
                                    const formData = new FormData();
                                    formData.set("test", id);
                                    formData.set("pass", password);
                                    await ProctorAction(formData);
                                }

                            }}
                            key={id}
                            size={"md"}
                        >
                            Start Proctoring
                        </Button>
                </Flex>
            </Container>

        </>)
    }
    return (
        <>
            
            <Nav/>
            <>
                {tests.map((test: any) => (
                    <TestCard id={test.id} description={test.description} start={test.start_time} end={test.end_time} registered={registeredids.has(test.id)}></TestCard>
                ))}
            </>
        </>
    );
}
