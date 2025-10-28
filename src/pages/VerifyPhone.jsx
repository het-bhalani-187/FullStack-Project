import React, { useState } from 'react';
import { Box, Button, Input, Text, VStack, useToast } from '@chakra-ui/react';

const VerifyPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const toast = useToast();

  const handleSendOTP = async () => {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      setShowOtpInput(true);
      toast({
        title: 'OTP Sent',
        description: 'Please check your phone for the verification code',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: formattedPhone,
          code: verificationCode 
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const data = await response.json();
      
      toast({
        title: 'Success',
        description: 'Phone number verified successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl">Phone Verification</Text>
        
        {!showOtpInput ? (
          <>
            <Input
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button colorScheme="blue" onClick={handleSendOTP}>
              Send OTP
            </Button>
          </>
        ) : (
          <>
            <Input
              placeholder="Enter OTP"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button colorScheme="green" onClick={handleVerifyOTP}>
              Verify OTP
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default VerifyPhone;
