'use client'
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/navigation';
import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  IconButton,
  createIcon,
  IconProps,
  useColorMode,
  useColorModeValue,
  extendTheme
} from '@chakra-ui/react'


export default function CallToActionWithVideo() {
  const router = useRouter();
  const Card = ({ heading, description, icon, href }) => {
    return (

      <Box
        textAlign={'center'}
        w={'352px'}
        h={'248px'}
        borderWidth="3px"
        borderRadius="3xl"
        backgroundColor="#f0f0f0"
        color="#1A202C"
        _hover={{
          boxShadow:colorMode==='light'?"0 0px 30px rgba(243, 81, 81, 0.5)":"0 0px 30px rgba(84, 125, 190, 1)"
         }
        }
        // marginRight={200}
        marginBottom={20}
        p={4}>
        <Text fontSize="3xl" mb={5} color={'#f35151'} fontFamily={'Meta Serif Pro'}>{heading}</Text>
        <Text fontSize="lg">{description}</Text>
      </Box>
    )
  }

  const {colorMode} = useColorMode();
  // console.log(colorMode);
  return (
    <div style={{ backgroundColor: colorMode==='light'?'#f0f0f0':'#1A202C',fontFamily:'meta-serif-pro' }}>
      <Navbar></Navbar>
      <Container
        maxW={'7xl'} borderRadius={15} mt={'5'} mb={'20'} sx={{ background: colorMode==='light'? 'rgba(84,125,190,.17)': 'rgba(255,255,255,0.9)'}} >
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}

          direction={{ base: 'column', md: 'row' }}>
          <Stack
            paddingTop="0rem !important" flex={1} spacing={{ base: 5, md: 10 }} textAlign={'center'} alignItems={'center'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              fontFamily={'Meta Serif Pro'}
            >
              <Text
                as={'span'}
                position={'relative'}
                color={'black'}
              >
                AI Assisted Proctoring
              </Text>
              <br />
              <Text as={'span'} color={'#f35151'}>
                for all Hackathons
              </Text>
            </Heading>
            <Text color={'gray.500'}>

              Get a load of this BULLSHIT, we are a bunch of smart asses who are trying to fuck you students by making a website that will make it impossible for you to cheat in your online tests.
            </Text>
            <Flex>
              <Button
                onClick={(e) => {
                  router.push("/login?hasAccount=false")
                }}
                colorScheme={'black'}
                variant={'outline'}
                rounded={'full'}
                size={'lg'}
                boxShadow={"md"}
                mr={10}
                color={'#f35151'}
                _hover={{
                  color: 'white',
                  bg: '#f35151',
                }}>
                Login
              </Button>
              <Button
              onClick={(e) => {
                router.push("/login?hasAccount=true")
              }}
                colorScheme={'black'}
                rounded={'full'}
                bg='#f35151'
                border={'1px'}
                boxShadow={"md"}
                size={'lg'}
                color={'white'}
                _hover={{
                  color: '#f35151',
                  bg: 'none',
                  border: '1px'
                }}>
                Sign Up
              </Button>
            </Flex>

          </Stack>
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
            paddingTop={0}>

            <Box
              position={'relative'}
              rounded={'2xl'}
              // boxShadow={'2xl'}
              overflow={'hidden'}
            >

              <Image
                mixBlendMode={'multiply'}
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                objectFit={'scale-down'}
                src={
                  'img.jpg'
                }
              />
            </Box>
          </Flex>
        </Stack>
      </Container>
      <Box p={4}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
            Features Offered:
          </Heading>
          <Text color={colorMode==='light'?'gray.700':'gray.300'} fontSize={{ base: 'sm', sm: 'lg' }}>
            We offer loads of never before seen features in a proctoring website. A few of the features we have implemented are:
          </Text>
        </Stack>

        <Container maxW={'7xl'} mt={12}>
          <Flex flexWrap="wrap" gridGap={20} justify="center" alignItems={"center"}>
            <Card
              heading={'ID Verification'}
              description={'Teachers do not need to verify each student giving the exam, our AI models do it for you. Convenient and simple.'}
              href={'#'}
            />
            <Card
              heading={'Heading'}
              description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
              href={'#'}
            />
          </Flex>
          <Flex flexWrap="wrap" gridGap={20} justify="center" alignItems={"center"}>
            <Card
              heading={'Heading'}
              description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
              href={'#'}
            />
            <Card
              heading={'Heading'}
              description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
              href={'#'}
            />
          </Flex>
        </Container>
      </Box>
      <Footer></Footer>
    </div>
  )
}

