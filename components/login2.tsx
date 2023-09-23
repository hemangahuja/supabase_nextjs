"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Flex,
    Heading,
    Input,
    Button,
    FormControl,
    FormLabel,
    Switch,
    useColorMode,
    useColorModeValue,
    Select,
    Box,
} from "@chakra-ui/react";

const Login = ({ initialHasAccount }) => {
    const { toggleColorMode } = useColorMode();
    const formBackground = useColorModeValue("gray.100", "gray.700");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasAccount, setHasAccount] = useState(initialHasAccount);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("student");
    const supabase = createClientComponentClient();
    const router = useRouter();
    const action = hasAccount ? "Log In" : "Sign Up";
    const handleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.log(error.message);
            setError(error.message);
            setLoading(false);
        } else router.refresh();
    };
    const handleSignUp = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            alert(error.message);
            return;
        }
        await supabase.from("users").insert({
            id: data.session?.user.id,
            name,
            category,
            email,
        });
        await handleSignIn();
    };
    return (
        <Flex h="100vh" alignItems="center" justifyContent="center">
            <Flex
                flexDirection="column"
                bg={formBackground}
                p={12}
                borderRadius={8}
                boxShadow="lg"
            >
                <Heading mb={6}>{action}</Heading>
                {!hasAccount && (
                    <Input
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        type="string"
                        variant="filled"
                        mb={3}
                    />
                )}
                <Input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    type="email"
                    variant="filled"
                    mb={3}
                />
                <Input
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="**********"
                    type="password"
                    variant="filled"
                    mb={6}
                />
                {!hasAccount && (
                    <Select
                        placeholder="Select option"
                        mb={6}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="option2">Proctor</option>
                        <option value="option3">Student</option>
                    </Select>
                )}
                <Button
                    colorScheme="teal"
                    mb={8}
                    onClick={hasAccount ? handleSignIn : handleSignUp}
                >
                    {action}
                </Button>

                <Box
                    onClick={() => setHasAccount((prev) => !prev)}
                    mb={6}
                    className="hover:cursor-pointer"
                    textAlign={"center"}
                    color={"cyan.700"}
                >
                    {hasAccount
                        ? "Don't have an account?"
                        : "Already have an account?"}
                </Box>

                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="dark_mode" mb="0">
                        Enable Dark Mode?
                    </FormLabel>
                    <Switch
                        id="dark_mode"
                        colorScheme="teal"
                        size="lg"
                        onChange={toggleColorMode}
                    />
                </FormControl>
            </Flex>
        </Flex>
    );
};

export default Login;
