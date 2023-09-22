'use client'

import {
    Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
    Icon,
    useColorModeValue,
    useColorMode,
    Flex,
    Input,
    Center,
    FormLabel,
    FormControl,
    Switch,
    InputLeftAddon,
    InputGroup,
    Select,
    Grid,
    Radio,
    RadioGroup
} from '@chakra-ui/react'

import NavbarUse from './Navbar'
import { useState } from 'react'
// import Question from './Question'

function Question(props) {
    const [question, setQuestion] = useState(props.question);
    const [type, setType] = useState(props.type);
    const [answer, setAnswer] = useState(props.answer);

    return
    (<div>HELLO
    </div>)
}
export default function Testinput() {
    const { colorMode, toggleColorMode } = useColorMode()
    const formBackground = useColorModeValue('gray.100', 'gray.700');
    const [inputs, setInputs] = useState([<Question question="hey" type="mxq" answer="null" ></Question>])
    const addState = () => {
        setInputs([...inputs, <Question question="" type="" answer="" ></Question>])
    }
    return (

        <>
            <NavbarUse />
            <Flex marginTop={"10"} alignItems="center" justifyContent="center">
                <Flex
                    flexDirection="column"
                    bg={formBackground}
                    p={12}
                    borderRadius={8}
                    boxShadow="lg"
                >
                    <Heading mb={6}>Test Details</Heading>
                    <InputGroup>
                        <InputLeftAddon w="130px" textAlign="center"> Description</InputLeftAddon>
                        <Input
                            placeholder="lmfao"
                            type="text"
                            variant="outline"
                            mb={3}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon w="130px" textAlign="center">Password</InputLeftAddon>
                        <Input
                            placeholder="**************"
                            type="text"
                            variant="outline"
                            mb={3}
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon w="130px" textAlign="center">Start Time</InputLeftAddon>
                        <Input
                            type="datetime-local"
                            variant="filled"
                            mb={3}
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputLeftAddon w="130px" textAlign="center">End Time</InputLeftAddon>
                        <Input
                            type="datetime-local"
                            variant="filled"
                            mb={7}
                        />

                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon w="130px" textAlign="center">Question:</InputLeftAddon>
                        <Input
                            // onChange={e => setQuestion(e.target.value)}
                            type="text"
                            variant="filled"
                            mb={3}
                        />
                    </InputGroup>
                    <InputGroup mb={3}>
                        <InputLeftAddon w="130px" textAlign="center">Type:</InputLeftAddon>
                        <RadioGroup>
                            <Stack direction='row'>
                                <Radio value='1'>MCQ</Radio>
                                <Radio value='2'>Descriptive</Radio>
                                <Radio value='3'>Coding</Radio>
                            </Stack>
                        </RadioGroup>
                    </InputGroup>
                    <InputGroup>
                        <InputLeftAddon w="130px" textAlign="center">Answer:</InputLeftAddon>
                        <Input
                            // onChange={e => setAnswer(e.target.value)}
                            type="text"
                            variant="filled"
                            mb={3}
                        />
                    </InputGroup>

                    <Button onClick={(e) => addState()}>ADD</Button>
                </Flex>
            </Flex>
            <Grid>
                {
                    inputs.map(input => input)
                }
            </Grid>

        </>
    )
}
