import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
//import ManualHeader from "../components/ManualHeader";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { useMoralis } from "react-moralis";

const supportedChains = ["31337", "5"];

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis();

    return (
        <>
            <div className={styles.container}>
                <Head>
                    <title>Universal Basic Information Dashboard</title>
                    <meta name="description" content="Universal Basic Income (UBI) DAO Dashboard" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Header />
                {isWeb3Enabled ? (
                    <div>
                        {supportedChains.includes(parseInt(chainId).toString()) ? (
                            <div className="flex flex-row">
                                <Dashboard className="p-8" />
                            </div>
                        ) : (
                            <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
                        )}
                    </div>
                ) : (
                    <div>
                        Please connect to a Wallet, so you can mine income while mining information!
                    </div>
                )}
            </div>
        </>
    );
}
