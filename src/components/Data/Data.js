import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tfoot,
  Button,
  Center,
} from "@chakra-ui/react";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyArY3o16sAFHluJ3jU81kbE6tZNoNO-R60",
  authDomain: "demo1-6b4f0.firebaseapp.com",
  databaseURL:
    "https://demo1-6b4f0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "demo1-6b4f0",
  storageBucket: "demo1-6b4f0.appspot.com",
  messagingSenderId: "307803330427",
  appId: "1:307803330427:web:799a09cd95ca79eb610fde",
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
    const header = Object.keys(data[0]);

    rows.push(header.join(","));

    data.forEach((item) => {
      const values = header.map((key) => {
        const value = item[key];
        if (typeof value === "object" && value !== null) {
          // If the value is an object, serialize it to a JSON string
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
      const record = data[key];
      return { ...record, key };
    });

    // Convert the data array to CSV format
    const csv = convertToCSV(dataArray);
    downloadCSV(csv, "mydata.csv");
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
              <Th>CheckIn/Out Date </Th>
              <Th>CheckIN/Out Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(data).map((key) => {
              return (
                <Tr key={key}>
                  <Td>{data[key]["Bus No"]}</Td>
                  <Td>
                    <Badge
                      colorScheme={data[key].Status === true ? "green" : "red"}
                    >
                      {data[key].Status === true ? "CheckIn" : "CheckOut"}
                    </Badge>
                  </Td>
                  <Td>{data[key].Date}</Td>
                  <Td>{data[key].Time}</Td>
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
