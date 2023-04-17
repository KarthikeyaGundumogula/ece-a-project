import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Center,
} from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAhj_xf6z6VIbWFxvq9FfUgh3BL5JbCpgU",
  authDomain: "rfid-4ddc6.firebaseapp.com",
  databaseURL: "https://rfid-4ddc6-default-rtdb.firebaseio.com",
  projectId: "rfid-4ddc6",
  storageBucket: "rfid-4ddc6.appspot.com",
  messagingSenderId: "596055244887",
  appId: "1:596055244887:web:7b61f8e3af8e720139e312",
  measurementId: "G-JRZ19F2XJ5",
};

const app = initializeApp(firebaseConfig);

import { Badge } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Data = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
  function convertToCSV(data) {
    const rows = [];
    let header = Object.keys(data[0]);

    rows.push(["Bus NO", "Date", "Time"].join(","));

    data.forEach((item) => {
      const values = header.map((key) => {
        const value = item[key];
        if (typeof value === "string") {
          return value.split("_").join(",");
        } else if (typeof value === "object" && value !== null) {
          return JSON.stringify(value);
        } else {
          return value;
        }
      });
      rows.push(values.join(","));
    });

    return rows.join("\n");
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  const handleDownload = () => {
    const dataArray = Object.keys(data).map((key) => {
      const record = data[key].split("_");
      return { ...record };
    });

    // Convert the data array to CSV format
    const csv = convertToCSV(dataArray);
    downloadCSV(csv, "report.csv");
  };

  return (
    <div>
      <TableContainer margin={10} width={1000} m="10 ">
        <Table
          variant="simple"
          borderColor={"black"}
          borderWidth={1}
          colorScheme="black"
        >
          <Thead>
            <Tr>
              <Th>Bus No.</Th>
              <Th>Status</Th>
              <Th>CheckIn Date </Th>
              <Th>CheckIN Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(data).map((key) => {
              const dataArray = data[key].split("_");
              return (
                <Tr key={key}>
                  <Td>{dataArray[0]}</Td>
                  <Td>
                    <Badge colorScheme={"green"}>CheckIn</Badge>
                  </Td>
                  <Td>{dataArray[1]}</Td>
                  <Td>{dataArray[2]}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Center>
        <Button onClick={handleDownload}>Download Report</Button>
      </Center>
    </div>
  );
};

export default Data;
