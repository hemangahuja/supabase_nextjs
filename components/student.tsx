"use client";
import StudentAction from "@/actions/student-register";
import { Container, Text, Button, Flex } from "@chakra-ui/react";
import Nav from "./Navbar";
import { useRouter } from "next/navigation";
export default function Student({
    tests,
    registeredids,
}: {
    tests: any;
    registeredids: Set<any>;
}) {
    const router = useRouter();
    const submit = async (id: any) => {
        const formData = new FormData();
        formData.set("test", id);
        console.log(formData);
        await StudentAction(formData);
    };
    function TestCard({
        id,
        description,
        start,
        end,
        registered,
    }: {
        id: any;
        description: any;
        start: any;
        end: any;
        registered: any;
    }) {
        const startD = new Date(start);

        return (
            <>
                <Container
                    width="4xl"
                    height="150px"
                    bg="#f35151"
                    mb={6}
                    borderRadius={"10px"}
                    padding={"20px"}
                >
                    <Flex justifyContent={"space-between"} mb={5}>
                        <Text fontSize="2xl" as="b" textAlign={"left"}>
                            {description.toUpperCase()}
                        </Text>
                        <Text fontSize="2xl" as="b" textAlign={"right"}>
                            {startD.getHours()}:{startD.getMinutes()}
                        </Text>
                    </Flex>
                    <Flex alignItems={"center"}>
                        {registered ? (
                            <>
                                <Button
                                    onClick={() => {
                                        router.push(`/test/${id}`);
                                    }}
                                    key={id}
                                    size={"md"}
                                >
                                    Start Test
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={async () => {
                                    if (registered) {
                                        alert("Already registered");
                                        return;
                                    }
                                    await submit(id);
                                }}
                                key={id}
                                size={"md"}
                            >
                                Register
                            </Button>
                        )}
                    </Flex>
                </Container>
            </>
        );
    }
    return (
        <>
            <Nav />
            <>
                {tests.map((test: any) => (
                    <TestCard
                        id={test.id}
                        description={test.description}
                        start={test.start_time}
                        end={test.end_time}
                        registered={registeredids.has(test.id)}
                    ></TestCard>
                ))}
            </>
        </>
    );
}
