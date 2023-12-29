import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Grid,
  GridItem,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import Papa from 'papaparse';
import GetEmailValues from "./GetEmailValues";


export default function MyForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [extractedEmails, setExtractedEmails] = useState({});
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isEmailVisiable,setIsEmailVisible] = useState(false);
  const [isEmailInputVisible, setIsEmailInputVisible] = useState(true);
  var separatedEmails = [];
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: handleParseComplete,
        header: true,
      });
    }
  };

  const handleParseComplete = (result) => {
      console.log("Result after persaing",result)
    const emails = result.data.map((row) => row); // Adjust the key based on your Excel structure
    setExtractedEmails(emails);
  };

const handleEmailDelete = (email) => {
  console.log("Extracted Emails for delete",email);
  if (extractedEmails.length > 0) {
    const allEmails = extractedEmails.map((email) => email.email).join(';');
    var onlyEmails = allEmails.split(';');
    console.log(onlyEmails);
    const updatedEmail = onlyEmails.filter((d)=> d !== email);
    console.log(updatedEmail);
    setSelectedEmail(updatedEmail);
  }

  // Check if the index is provided
//   if (index >= 0 && index < extractedEmails.length) {
//     // Create a copy of the array
//     const updatedEmails = [...extractedEmails];

//     // Use splice to remove the email at the specified index
//     updatedEmails.splice(index, 1);

//     console.log("Updated Emails", updatedEmails);

//     // Set the state with the updated array
//     setExtractedEmails(updatedEmails);
//   } else {
//     console.log("Invalid or missing index");
//   }
};

  
  const handleExtractClick = () => {
    if (extractedEmails.length > 0) {
      const allEmails = extractedEmails.map((email) => email.email).join(';');
      separatedEmails = allEmails.split(';');
      setSelectedEmail(separatedEmails);
      setIsEmailVisible(true);
      console.log('Extracted Emails:', separatedEmails,selectedEmail);
    }
    return separatedEmails;
  };

  console.log("Separated emails outside the function",separatedEmails)
  
  const baseUrl = "https://emailsend.onrender.com/";

  const sendEmail = async () => {
    let dataSend = {
      email: selectedEmail, // Use selectedEmail instead of email
      subject: subject,
      message: message,
    };
  
    console.log('Data to be sent:', dataSend);
  
    const resValue = await fetch(`${baseUrl}/email/sendEmail`, {
      method: "POST",
      body: JSON.stringify(dataSend),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: 'include',
      
    })
    .then((res) => {
      console.log('Response from server:', res);
  
      if (res.status > 199 && res.status < 300) {
        alert("Send Successfully !");
      }
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
    console.log('.......res',resValue);
  };
 
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Send email to the account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Add Your file</FormLabel>
            <input
              type="file"
              placeholder="Receiver's Email Address"
              onChange={handleFileChange}
              style={{
                padding: '5px',
                border: '1px solid gray',
                borderRadius: '5px',
                float: 'left',
                width: '85%',
                height: '37px',
              }}
            />
            <button style={{
              background: 'white',
              border: '1px solid #1a202c',
              borderRadius: '5px',
              height: '35px',
              width: '13%'
            }} onClick={handleExtractClick}><i class="fa-solid fa-paper-plane"></i></button>
            <br/>
            <br/>
            <div className="receiver_email" style={{
              background: '#8080804f',
              borderRadius: '5px',
              height: '100px',
              paddingTop: '8px',
              textAlign: 'left',
              paddingLeft: '8px',
              overflow: 'scroll',
            }}
            >
            {
              (selectedEmail && isEmailVisiable) ? (
                <>
                  {selectedEmail.map((email, index) => {
                    console.log("Email & index value in child component", email,index); // Logging the value
                    return (
                      <GetEmailValues key={index} value={email} onDelete={() => handleEmailDelete(email)} />
                    );
                  })}
                </>
              ) : (
                <>
                  <h3 style={{ color: '#666' }}>Get Receiver's Email</h3>
                </>
              )
            }
            
            
            </div>
            </FormControl>
            <FormControl id="email" style={{ display: isEmailInputVisible ? 'none' : 'none' }}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={selectedEmail}
                placeholder="Receiver's Email Address"
                onChInvalid or missing idange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Subject</FormLabel>
              <Input
                onChange={(e) => setSubject(e.target.value)}
                type="text"
                placeholder="Enter the subject here..."
              />
            </FormControl>
            <FormControl id="text">
              <FormLabel>Message</FormLabel>
              <Textarea
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={() => sendEmail()}
              >
                Send Email
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
