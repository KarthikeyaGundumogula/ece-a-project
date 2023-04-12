import React from "react";
import Header from "@/components/Header/Header";
import Data from "@/components/Data/Data";
import { ChakraProvider, Center } from "@chakra-ui/react";
const index = () => {
  return (
    <ChakraProvider>
      <Header />
      <Center>
        <Data />
      </Center>
    </ChakraProvider>
  );
};

export default index;
