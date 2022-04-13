import Navbar from "../components/Navbar";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

export default function Home() {
    return (<Container>
        <Head>
            <title>
                Whatsapp - Home
            </title>
        </Head>
        <Navbar/>
        <HomeContainer>
            <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" height={180} alt={"Logo"}/>
            <span>Whatsapp</span>
        </HomeContainer>
    </Container>)
}

const Container = styled.div`
  display: flex;
`;

const HomeContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: scroll;
  height: 100vh;

  > img {
    margin-bottom: 30px;
  }

  > span {
    font-size: 30px;
    font-weight: bold;
    color: #3CBC28;
  }

  //Hide Scrollbar
  ::-webkit-scrollbar {
    display: none;
  }

  //IE and Edge
  -ms-overflow-style: none;
  //Firefox
  scrollbar-width: none;
`;