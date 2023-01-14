import { contractAddresses, abi } from "../constants";
// don't export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
import Image from "next/image";
import portland from "../images/PortlandWhoVotedStudy.png";

export default function UBIDashboard() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const ubiDashAddress = "0xB73142c2b34Bc3BFadc3c140BCb1FE5aA68cC941"; // contractAddresses[5];

    // State hooks
    const [ubiRoundNumber, setUBIRoundNumber] = useState("0");
    const [totalUBIEver, setTotalUBIEver] = useState("0");
    const [ubiRoundOpenTime, setUBIRoundOpenTime] = useState("0");
    const [ubiStats, setUBIStats] = useState("0");
    const [dcwScoreFromCall, setDCWScore] = useState("0");
    const [ubiTokenAddress, setUBITokenAddress] = useState("0");
    const [whoVotedThisRound, setWhoVotedThisRound] = useState("0");
    const [status, setStatus] = useState("0");

    const dispatch = useNotification();

    /* View Functions */
    const { runContractFunction: getUBIRoundNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: ubiDashAddress,
        functionName: "ubiRoundNumber",
    });

    const { runContractFunction: getTotalUBIEver } = useWeb3Contract({
        abi: abi,
        contractAddress: ubiDashAddress,
        functionName: "totalUBIEver",
    });

    const { runContractFunction: getUBIRoundOpenTime } = useWeb3Contract({
        abi: abi,
        contractAddress: ubiDashAddress,
        functionName: "ubiRoundOpenTime",
    });

    const { runContractFunction: getUBIStats } = useWeb3Contract({
        abi: abi,
        contractAddress: ubiDashAddress,
        functionName: "getUBIStats",
    });

    const { runContractFunction: getTotalAVGDCWThisRound } = useWeb3Contract({
        abi: abi,
        contractAddress: ubiDashAddress,
        functionName: "getTotalAVGDCWThisRound",
    });

    const {
        runContractFunction: getUBITokenAddress,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: ubiDashAddress,
        functionName: "getUBITokenAddress",
    });

    const { runContractFunction: getWhoVotedThisRound } = useWeb3Contract({
        abi: abi,
        contractAddress: ubiDashAddress,
        functionName: "getWhoHasVotedThisRound",
    });

    /* Write Functions */
    async function register() {
        const registering = {
            contractAddress: ubiDashAddress,
            functionName: "register",
            abi: abi,
        };
        const userRegistration = await Moralis.executeFunction(registering);
        console.log(userRegistration.hash);
        await userRegistration.wait(1);
    }

    async function openRound() {
        const openingRound = {
            contractAddress: ubiDashAddress,
            functionName: "openRound",
            abi: abi,
        };
        const roundIsOpened = await Moralis.executeFunction(openingRound);
        console.log(roundIsOpened.hash);
        await roundIsOpened.wait(1);
    }

    async function closeRound() {
        const closingRound = {
            contractAddress: ubiDashAddress,
            functionName: "closeRound",
            abi: abi,
        };
        const roundHasClosed = await Moralis.executeFunction(closingRound);
        console.log(roundHasClosed.hash);
        await roundHasClosed.wait(1);
    }

    async function submitUBI(dcwScore) {
        const submitting = {
            contractAddress: ubiDashAddress,
            functionName: "submitUBI",
            abi: abi,
            params: { dcwScore: dcwScore },
        };
        const userSubmittal = await Moralis.executeFunction(submitting);
        console.log(userSubmittal.hash);
        await userSubmittal.wait(1);
    }

    async function withdrawUBI() {
        const withdrawing = {
            contractAddress: ubiDashAddress,
            functionName: "withdrawUBI",
            abi: abi,
        };
        const userPaymentWithdrawal = await Moralis.executeFunction(withdrawing);
        console.log(userPaymentWithdrawal.hash);
        await userPaymentWithdrawal.wait(1);
    }

    async function updateUIValues() {
        const ubiRoundNumber = await getUBIRoundNumber();
        const ubiRoundOpenTime = await getUBIRoundOpenTime();
        const totalUBIEver = await getTotalUBIEver();
        const dcwScoreFromCall = await getTotalAVGDCWThisRound();
        const ubiTokenAddress = await getUBITokenAddress();
        const whoVotedThisRound = await getWhoVotedThisRound();

        setUBIRoundNumber(ubiRoundNumber);
        setUBIRoundOpenTime(ubiRoundOpenTime);
        setTotalUBIEver(totalUBIEver);
        setDCWScore(dcwScoreFromCall);
        setUBIStats(ubiStats);
        setUBITokenAddress(ubiTokenAddress);
        setWhoVotedThisRound(whoVotedThisRound);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues();
        }
    }, [isWeb3Enabled]);

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        });
    };

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1);
            updateUIValues();
            handleNewNotification(tx);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            submitUBI(dcwScore);
            setStatus(`Successfully submitted dcwScore of: ${dcwScore}`);
        } catch (error) {
            setStatus(`Error submitting dcwScore: ${error.message}`);
        }
    };

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Universal Basic Information Dashboard</h1>
            <>
                <div>
                    Please register to participate in the Universal Basic Information Dashboard:
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    onClick={async () =>
                        await register({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }
                    disabled={isLoading || isFetching}
                >
                    {isLoading || isFetching ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        "Register"
                    )}
                </button>
            </>
            <h1 className="py-4 px-4 font-bold text-xl">UBI Rounds</h1>
            <>
                <div>
                    In production, the dashboard would not have Open Round and Close Round buttons.
                    Chainlink Automation would normally open and close rounds. This feature is
                    omitted for testing convenience. See the Usage section in the README. You should
                    be able to open and close a round at any time, unless someone else is using the
                    dapp concurrently. You can only submit UBI when a round is open. You can
                    withdraw UBI at any time once the round you voted in has closed.
                </div>
                <br />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    onClick={async () =>
                        await openRound({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }
                    disabled={isLoading || isFetching}
                >
                    {isLoading || isFetching ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        "Open Round"
                    )}
                </button>
                <br />
                <br />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    onClick={async () =>
                        await closeRound({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }
                    disabled={isLoading || isFetching}
                >
                    {isLoading || isFetching ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        "Close Round"
                    )}
                </button>
            </>
            <h1 className="py-4 px-4 font-bold text-xl">DAO/City Knowledge Section</h1>
            <div>
                This section can be used for DAO or City news, proposal/project updates, and general
                knowledge. It is a place to educate DAO members or citizens so that they vote in an
                informed manner. Quizzes similar to the following example can be used to check
                engagement:
            </div>
            <br />
            <div>
                According to the following graphic summary of a Portland State University study,
                which of the following cities had voter turnout percentages below 20%? Austin,
                Miami, New York, Los Angeles, or Phoenix
            </div>
            <Image
                src={portland}
                alt='Graph from 2016 Portland State "Who Votes for Mayor" Study'
                width="350px"
                height="300px"
            />
            <div>
                2016 Portland State &quot;Who Votes for Mayor&quot; Study:
                http://whovotesformayor.org/
            </div>
            <br />
            <div>Correct answer is all of them.</div>
            <br />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">
                {isLoading || isFetching ? (
                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                    "Placeholder DAO Knowledge Submitting Button"
                )}
            </button>
            <br />
            <h1 className="py-4 px-4 font-bold text-xl">UBI Information Submission Section</h1>
            <div>
                Once DAO members / citizens have completed the Knowledge section, this section
                appears. This is where the pulse of the DAO or city is taken. It&apos;s also where
                UBI stats can be displayed. These stats are taken directly from the testnet
                blockchain and should be updated whenever someone submits their DCW score:
                <div>
                    <br />
                    <u>Current UBI Stats:</u>
                </div>
                <div>UBI Round Number: #{ubiRoundNumber}</div>
                <div>Current round opened at (in unix time): {ubiRoundOpenTime.toString()}</div>
                <div>
                    Avg DAO/Democratic Collective Welfare Score for this round: {dcwScoreFromCall}
                </div>
                <div>Total DUBI distributed ever: {totalUBIEver.toString() / 1e18} </div>
                <div>DAO UBI Token (DUBI) Address: {ubiTokenAddress.toString()} </div>
                <div>Addresses that have voted this round: {whoVotedThisRound.toString()} </div>
                <br />
            </div>
            <div>
                Please consider how satisfied you are with your DAO/city and enter your
                DAO/Democratic Collective Welfare Score for this round. (An error may pop up when
                you put your cursor in the input box, but you can disregard it and enter a number
                and hit submit, and it should send the transaction to your MetaMask.)
            </div>
            <form onClick={handleSubmit}>
                {/* <label htmlFor="dcwScore">DCW Score:</label> */}
                <input id="dcwScore" placeholder=" Enter your DCW score" />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    type="submit"
                >
                    Submit
                </button>
            </form>
            <h1 className="py-4 px-4 font-bold text-xl">
                DAO/City Formal Proposal Voting - PLACEHOLDER SECTION
            </h1>
            <div>
                Once DAO members / citizens both intake information and submit their own, they are
                able to see this section and vote on proposals.
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">
                {isLoading || isFetching ? (
                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                    "Placeholder Voting Button"
                )}
            </button>
            <br />
            <h1 className="py-4 px-4 font-bold text-xl">UBI Payments</h1>
            <div>
                If users have completed and submitted the UBI round, once the round closes, the
                following section will appear, and they can withdraw their UBI payment of 1000 DUBI
                (DAO UBI).
            </div>
            <br />
            <div>UBI round # has closed. Please withdraw your payment of 1000 DUBI:</div>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                onClick={async () =>
                    await withdrawUBI({
                        onSuccess: handleSuccess,
                        onError: (error) => console.log(error),
                    })
                }
                disabled={isLoading || isFetching}
            >
                {isLoading || isFetching ? (
                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                    "Withdraw UBI"
                )}
            </button>
        </div>
    );
}
