import {useState} from 'react'
import {Container, Box, useToast} from '@chakra-ui/react'
import Header from './components/Header'
import Footer from './components/Footer'
import TextInput from './components/TextInput'
import KeywordsModal from './components/KeywordsModal'

const App = () => {
  const [keywords, setKeywords] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const extractKeywords = async (text) => {
    setLoading(true)
    setIsOpen(true)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: 'Extract keywords from this text. Make the first letter of each word uppercase, and seperate each keyword with commas\n\n' + text,
        temperature: 0.5,
        max_tokens: 60,
        frequency_penalty: 0.8
      })
    }
    try {
      const response = await fetch(import.meta.env.VITE_OPENAI_API_URL, options)
      const json = await response.json();
  
      const data = json.choices[0].text.trim();
  
      console.log(data)
      setKeywords(data)
      setLoading(false) 
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something went wrong!',
        description: 'It seems OpenAI is not currently responding. Please try again later.',
        status: 'error',
        duration: 2000,
        isClosable: false
      })
    setIsOpen(false)
      setLoading(false)
    }
  }

  const closeModal = () => {setIsOpen(false)}
  return (
      <Box bg='blue.600' color='white' height='100vh' paddingTop={130}>
        <Container maxW='3xl' centerContent>
          <Header/>
          <TextInput extractKeywords={extractKeywords}/>
          <Footer/>
        </Container>
        <KeywordsModal keywords={keywords} isOpen={isOpen} loading={loading} closeModal={closeModal}/>
      </Box>
  )
}

export default App