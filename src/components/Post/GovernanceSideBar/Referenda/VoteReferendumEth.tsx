// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { InjectedWindowProvider } from '@polkadot/extension-inject/types';
import { Button, Form, Modal, Segmented, Select, Spin, Alert } from 'antd';
import BN from 'bn.js';
import React, { memo, useEffect, useMemo,useState } from 'react';
import { chainProperties } from 'src/global/networkConstants';
import { EVoteDecisionType, ILastVote, LoadingStatusType,NotificationStatus, Wallet } from 'src/types';
import AccountSelectionForm from 'src/ui-components/AccountSelectionForm';
import BalanceInput from 'src/ui-components/BalanceInput';
import queueNotification from 'src/ui-components/QueueNotification';
import styled from 'styled-components';
import Web3 from 'web3';
import { WalletIcon } from '~src/components/Login/MetamaskLogin';
import WalletButton from '~src/components/WalletButton';
import { useApiContext, useNetworkContext, usePostDataContext, useUserDetailsContext } from '~src/context';
import { ProposalType } from '~src/global/proposalType';
import LoginToVote from '../LoginToVoteOrEndorse';
import CastVoteIcon from '~assets/icons/cast-vote-icon.svg';
import LikeWhite from '~assets/icons/like-white.svg';
import LikeGray from '~assets/icons/like-gray.svg';
import DislikeWhite from '~assets/icons/dislike-white.svg';
import DislikeGray from '~assets/icons/dislike-gray.svg';

import CloseCross from '~assets/icons/close-cross-icon.svg';
import DownIcon from '~assets/icons/down-icon.svg';
import { poppins } from 'pages/_app';
import DelegationSuccessPopup from '~src/components/Listing/Tracks/DelegationSuccessPopup';
import dayjs from 'dayjs';
import { getConvictionVoteOptions } from './VoteReferendum';
import { InjectedTypeWithCouncilBoolean } from '~src/ui-components/AddressDropdown';
const ZERO_BN = new BN(0);

interface Props {
	className?: string;
	referendumId?: number | null | undefined;
	onAccountChange: (address: string) => void;
	lastVote: ILastVote | undefined;
	setLastVote: React.Dispatch<React.SetStateAction<ILastVote | undefined>>;
	address: string;
	availableWallets: Record<string, InjectedWindowProvider>;
	setSelectedWallet: (wallet: Wallet) => void;
	selectedWallet: Wallet | null;
	accounts: InjectedTypeWithCouncilBoolean[];
	isTalismanEthereum: boolean;
	isMetamaskWallet: boolean;
}

const abi = require('../../../../moonbeamAbi.json');

const contractAddress = process.env.NEXT_PUBLIC_DEMOCRACY_PRECOMPILE;

const VoteReferendum = ({ className, referendumId, onAccountChange, lastVote, setLastVote, accounts, setSelectedWallet, selectedWallet, availableWallets, isMetamaskWallet, isTalismanEthereum, address }: Props) => {
	const userDetails = useUserDetailsContext();
	const { apiReady, api } = useApiContext();
	const { network } = useNetworkContext();
	const { setPostData, postData: { postType: proposalType } } = usePostDataContext();
	const { isLoggedOut, walletConnectProvider } = userDetails;
	const [showModal, setShowModal] = useState<boolean>(false);
	const [lockedBalance, setLockedBalance] = useState<BN | undefined>(undefined);
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: false, message: '' });
	const CONVICTIONS: [number, number][] = [1, 2, 4, 8, 16, 32].map((lock, index) => [index + 1, lock]);
	const [balanceErr, setBalanceErr] = useState('');
	const [availableBalance, setAvailableBalance] = useState<BN>(ZERO_BN);
	const [ayeNayForm] = Form.useForm();

	const [vote,setVote] = useState< EVoteDecisionType>(EVoteDecisionType.AYE);
	const [successModal,setSuccessModal] = useState(false);

	const convictionOpts = useMemo(() => {
		return getConvictionVoteOptions(CONVICTIONS, proposalType, api, apiReady, network);
	},[CONVICTIONS, proposalType, api, apiReady, network]);

	const [conviction, setConviction] = useState<number>(0);

	useEffect(() => {
		setPostData((prev) => {
			return {
				...prev,
				postType: ProposalType.REFERENDUMS
			};
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//const onBalanceChange = (balance: BN) => setLockedBalance(balance);

	const onBalanceChange = (balance: BN) => {
		if(!balance) return;

		else if(availableBalance.lte(balance)){
			setBalanceErr('Insufficient balance.');
		}else{
			setBalanceErr('');
			setLockedBalance(balance);
		}
	};

	const handleOnBalanceChange = (balanceStr: string) => {
		let balance = ZERO_BN;

		try{
			balance = new BN(balanceStr);
		}
		catch(err){
			console.log(err);
		}

		setAvailableBalance(balance);
	};

	const voteReferendum = async (aye: boolean) => {
		if (!referendumId && referendumId !== 0) {
			console.error('referendumId not set');
			return;
		}

		if(!isTalismanEthereum){
			console.error('Please use Ethereum account via Talisman wallet.');
			return;
		}

		if (!lockedBalance) {
			console.error('lockedBalance not set');
			return;
		}
		if(availableBalance.lte(lockedBalance)) return;

		// const web3 = new Web3(process.env.REACT_APP_WS_PROVIDER || 'wss://wss.testnet.moonbeam.network');
		let web3 = null;
		let chainId = null;

		if(walletConnectProvider?.wc.connected) {
			await walletConnectProvider.enable();
			web3 = new Web3((walletConnectProvider as any));
			chainId = walletConnectProvider.wc.chainId;
		}else {
			const newWindow = (window as any);
			web3 = new Web3((selectedWallet === Wallet.TALISMAN? newWindow.talismanEth : newWindow.ethereum));
			chainId = await web3.eth.net.getId();
		}

		if (chainId !== chainProperties[network].chainId) {
			queueNotification({
				header: 'Wrong Network!',
				message: `Please change to ${network} network`,
				status: NotificationStatus.ERROR
			});
			return;
		}

		setLoadingStatus({ isLoading: true, message: 'Waiting for confirmation' });

		const voteContract = new web3.eth.Contract(abi, contractAddress);

		// estimate gas.
		//https://docs.moonbeam.network/builders/interact/eth-libraries/deploy-contract/#interacting-with-the-contract-send-methods

		voteContract.methods
			.standard_vote(
				referendumId,
				aye,
				lockedBalance.toString(),
				conviction
			)
			.send({
				from: address,
				to: contractAddress
			})
			.then(() => {
				setLoadingStatus({ isLoading: false, message: '' });
				setLastVote({
					balance: lockedBalance,
					conviction: conviction,
					decision: vote,
					time: new Date()
				});
				setShowModal(false);
				setSuccessModal(true);
				queueNotification({
					header: 'Success!',
					message: `Vote on referendum #${referendumId} successful.`,
					status: NotificationStatus.SUCCESS
				});
			})
			.catch((error: any) => {
				setLoadingStatus({ isLoading: false, message: '' });
				console.error('ERROR:', error);
				queueNotification({
					header: 'Failed!',
					message: error.message,
					status: NotificationStatus.ERROR
				});
			});
	};

	if (isLoggedOut()) {
		return <LoginToVote />;
	}
	const openModal = () => {
		setShowModal(true);
	};

	console.log('accounts:-', accounts);

	const ConvictionSelect = ({ className }: { className?:string }) =>
		<Form.Item className={className}>
			<label  className='inner-headings'>
				Vote lock
			</label>

			<Select onChange={(key) => setConviction(Number(key))} size='large' className='rounded-[4px]' defaultValue={conviction} suffixIcon ={<DownIcon/>} >
				{convictionOpts}
			</Select>
		</Form.Item>;

	const handleWalletClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) => {
		event.preventDefault();
		setSelectedWallet(wallet);
	};

	const decisionOptions = [
		{
			label: <div className={`text-[#576D8B] h-[32px] rounded-[4px] ml-1 mr-1 w-full ${vote === 'aye'? 'bg-[#2ED47A] text-white' : ''}`}>{vote === EVoteDecisionType.AYE ? <LikeWhite className='mr-2 mb-[3px]' /> : <LikeGray className='mr-2 mb-[3px]' /> }<span className='font-medium'>Aye</span></div>,
			value: 'aye'
		},
		{
			label: <div className={` text-[#576D8B] h-[32px] w-full ml-1 mr-1 rounded-[4px] ${vote === 'nay'? 'bg-[#F53C3C] text-white' : ''}`}>{vote === EVoteDecisionType.NAY ? <DislikeWhite className='mr-2  ' /> : <DislikeGray className='mr-2' /> } <span className='font-medium'>Nay</span></div>,
			value: 'nay'
		}];

	return (
		<div className={className}>
			<Button
				className='bg-pink_primary hover:bg-pink_secondary text-lg mb-3 text-white border-pink_primary hover:border-pink_primary rounded-[4px] flex items-center justify-center p-6 w-[100%]'
				onClick={openModal}
			>
				{lastVote == null || lastVote == undefined ? 'Cast Vote Now' : 'Cast Vote Again' }
			</Button>
			<Modal
				open={showModal}
				onCancel={() => setShowModal(false)}
				footer={false}
				className={`w-[550px] max-md:w-full max-h-[675px] rounded-[6px] alignment-close ${poppins.className} ${poppins.variable}`}
				closeIcon={<CloseCross/>}
				title={ <div className='h-[65px] -mt-5 border-0 border-solid border-b-[1.2px] border-[#D2D8E0] mr-[-24px] ml-[-24px] rounded-t-[6px] flex items-center justify-center gap-2'>
					<CastVoteIcon className='mt-1'/>
					<span className='text-[#243A57] font-semibold tracking-[0.0015em] text-xl'>Cast Your Vote</span>
				</div>}
			>
				<>
					<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>

						<div className='text-sm font-normal flex items-center justify-center text-[#485F7D] mt-3'>Select a wallet</div>
						<div className='flex items-center gap-x-5 mt-1 mb-[24px] justify-center'>
							{ availableWallets[Wallet.TALISMAN] && <WalletButton className={`${selectedWallet === Wallet.TALISMAN? 'border border-solid border-pink_primary  w-[64px] h-[48px]': 'w-[64px] h-[48px]'}`}  disabled={!apiReady} onClick={(event) => handleWalletClick((event as any), Wallet.TALISMAN)} name="Talisman" icon={<WalletIcon which={Wallet.TALISMAN} className='h-6 w-6'  />} />}
							{ isMetamaskWallet && <WalletButton className={`${selectedWallet === Wallet.METAMASK? 'border border-solid border-pink_primary  w-[64px] h-[48px]': 'w-[64px] h-[48px]'}`}  disabled={!apiReady} onClick={(event) => handleWalletClick((event as any), Wallet.METAMASK)} name="MetaMask" icon={<WalletIcon which={Wallet.METAMASK} className='h-6 w-6' />} />}
						</div>

						{!isTalismanEthereum && <Alert message='Please use Ethereum account via Talisman wallet.' type='info'/>}
						{balanceErr.length > 0 && selectedWallet && <Alert type='info' message={balanceErr} showIcon className='mb-4'/>}
						{accounts.length === 0  && selectedWallet && !loadingStatus.isLoading && <Alert message='No addresses found in the address selection tab.' showIcon type='info' />}

						{
							accounts.length > 0?
								<AccountSelectionForm
									title='Vote with Account'
									accounts={accounts}
									address={address}
									withBalance
									onAccountChange={onAccountChange}
									onBalanceChange={handleOnBalanceChange}
									className={'text-sidebarBlue mb-[21px]'}
									inputClassName='rounded-[4px] px-3 py-1 h-[40px]'
									withoutInfo={true}
								/>
								: !selectedWallet? <Alert message='Please select a wallet.' showIcon type='info' />: null
						}
						<h3 className='inner-headings mt-6 mb-[2px]'>Choose your vote</h3>
						<Segmented
							block
							className={'mb-6 border-solid border-[1px] bg-white hover:bg-white border-[#D2D8E0] rounded-[4px] w-full'}
							size="large"
							value={vote}
							onChange={(value) => {
								setVote(value as EVoteDecisionType);
								ayeNayForm.setFieldValue('balance', ZERO_BN);
							}}
							options={decisionOptions}
							disabled={!apiReady}
						/>
						{
							<Form
								form={ayeNayForm}
								name='aye-nay-form'
								onFinish={async () => {
									vote === EVoteDecisionType.AYE && await voteReferendum(true);
									vote === EVoteDecisionType.NAY && await voteReferendum(false);
								}}>

								<BalanceInput
									label={'Lock balance'}
									helpText={'Amount of you are willing to lock for this vote.'}
									placeholder={'Add Balance'}
									onChange={onBalanceChange}
									inputClassName='text-[#7c899b] text-sm'
								/>
								<ConvictionSelect className={`${className}`} />

								<div className='flex justify-end mt-[-1px] pt-5 mr-[-24px] ml-[-24px] border-0 border-solid border-t-[1.5px] border-[#D2D8E0]'>
									<Button className='w-[134px] h-[40px] rounded-[4px] text-[#E5007A] bg-[white] mr-[15px] font-semibold border-[#E5007A]' onClick={() => setShowModal(false)}>Cancel</Button>
									<Button className={`w-[134px] h-[40px] rounded-[4px] text-[white] bg-[#E5007A] mr-[24px] font-semibold border-0 ${(!lockedBalance || !selectedWallet) && 'opacity-50'}`} htmlType='submit' disabled={!lockedBalance || !selectedWallet}>Confirm</Button>
								</div>
							</Form>
						}
					</Spin>
				</>
			</Modal>
			<DelegationSuccessPopup title='Voted' vote={vote} isVote={true} balance={lockedBalance} open={successModal} setOpen={setSuccessModal}  address={address} isDelegate={true}  conviction={conviction}  votedAt={ dayjs().format('HH:mm, Do MMMM YYYY')} />
		</div>
	);
};

export default memo(styled(VoteReferendum)`
	.LoaderWrapper {
		height: 40rem;
		position: absolute;
		width: 100%;
	}

	.vote-form-cont {
		padding: 12px;
	}
	.alignment-close .ant-select-selector{
		border: 1px solid !important;
		border-color:#D2D8E0 !important;
		height: 40px;
		border-radius:4px !important;
	}
	
	.alignment-close .ant-select-selection-item{
		font-style: normal !important;
		font-weight: 400 !important;
		font-size: 14px !important;
		display: flex;
		align-items: center;
		line-height: 21px !important;
		letter-spacing: 0.0025em !important;
		color: #243A57 !important;
	}
	
	.alignment-close .ant-input-number-in-from-item{
		height: 39.85px !important;
	
	}
	
	.alignment-close .ant-segmented-item-label{
		display:flex ;
		justify-content: center;
		align-items:center;
		height:32px !important;
		border-radius:4px !important;
		padding-right:0px !important;
		padding-left:0px !important;
	}
	.alignment-close .ant-segmented {
		padding :0px !important;
	}
	
	.alignment-close .ant-select-selection-item{
		color: #243A57 !important;
	}
	.alignment-close .ant-select-focused{
		border: 1px solid #E5007A !important;
		border-radius:4px !important;
	}
	.alignment-close .ant-segmented-item-selected{
		box-shadow: none !important;
		padding-right:0px !important;
	}
	.alignment-close .ant-segmented-item{
		padding: 0px !important;
	}
	
	.alignment-close .ant-modal-close{
		margin-top: 4px;
	}
	.alignment-close .ant-modal-close:hover{
		margin-top: 4px;
	}
`);
