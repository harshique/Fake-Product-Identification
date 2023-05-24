import React, { useState, useEffect,useRef } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

import "../css/Authenticate.css";
const Authenticate = ({ account,contract }) => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");

  const videoRef = useRef(null);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing video stream:', error);
      });
  };

  useEffect(() => {
    startVideo()
  },[])

  return (
    <>
      <div className="cam">
        <h4 style={{ color: "#000", position: "fixed", right: 8, top: 2 }}>
          Wallet Address:{" "}
          {account.substring(0, 4) +
            "..." +
            account.substring(account.length - 4, account.length)}
        </h4>
        <br />
        <h2 style={{ position: "absolute", top: 20 }}>
          Hold QR Code Steady and Clear to Scan
        </h2>
        <div style={{ position: "absolute", top: 60 }}>
          <video ref={videoRef} autoPlay={true} />
        </div>    
        <QrReader
          onResult={async (result, error) => {
            if (!!result && !!result?.text) {
              let data = JSON.parse(result?.text);
              if (data.hash) {
                let res = await axios.get(
                  `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${data.hash}&apikey=1F75CUVAK1DCWYPUCSF9MCWWA32MCJE951`
                );
                if (res) {
                  setMessage("Product is Authenticated ✅");
                  setAuth(true);
                }
              }
            }
            if (!!error) {
              console.log(error);
            }
          }}
          style={{ width: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            top: "50%",
          }}
        >
        </div>
        <div style={{ position: "absolute", bottom: 140 }} >
            <h1>{message}</h1>
          </div>
        <div style={{ position: "absolute", bottom: 90 }}>
          <h3>
            Please wait for 15 sec if Authentication messages is not appearing
            on the screen then your product is not Authenticated.
          </h3>
          <br />
          <span>Please reload the page to Scan again.</span>
        </div>
      </div>
    </>
  );
};

export default Authenticate;
