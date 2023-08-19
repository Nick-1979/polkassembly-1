// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IName, ISocials, ITxFee } from '.';
import Address from '~src/ui-components/Address';
import HelperTooltip from '~src/ui-components/HelperTooltip';
import { Alert, Button, Divider, Form, Input } from 'antd';
import { EmailIcon, TwitterIcon } from '~src/ui-components/CustomIcons';
import { formatedBalance } from '~src/util/formatedBalance';
import { chainProperties } from '~src/global/networkConstants';
import { NetworkContext } from '~src/context/NetworkContext';
import styled from 'styled-components';
import { ApiContext } from '~src/context/ApiContext';
import _ from 'lodash';
import BN from 'bn.js';
import { BN_ONE } from '@polkadot/util';
import SuccessState from './SuccessState';

const ZERO_BN = new BN(0);

interface Props {
  className?: string;
  address: string;
  txFee: ITxFee;
  name: IName;
  onChangeName :(pre: IName) => void ;
  socials: ISocials;
  onChangeSocials:(pre: ISocials) => void;
  setTxFee: (pre: ITxFee) => void;
  startLoading: (pre: boolean) => void;
  onCancel:()=> void;
  perSocialBondFee: BN;
  changeStep: (pre: number) => void;
  closeModal: (pre: boolean) => void;
}
interface ValueState {
  info: Record<string, unknown>;
  okAll: boolean;
}

// interface IInfo {
//   displayNameVal?: string ;
//   legalNameVal?: string ;
//   emailVal?: string;
//   riotVal?: string;
//   twitterVal?: string;
//   webVal?: string;
// }

function checkValue (hasValue: boolean, value: string | null | undefined, minLength: number, includes: string[], excludes: string[], starting: string[], notStarting: string[] = WHITESPACE, notEnding: string[] = WHITESPACE): boolean {
	return !hasValue || (
		!!value &&
    (value.length >= minLength) &&
    includes.reduce((hasIncludes: boolean, check) => hasIncludes && value.includes(check), true) &&
    (!starting.length || starting.some((check) => value.startsWith(check))) &&
    !excludes.some((check) => value.includes(check)) &&
    !notStarting.some((check) => value.startsWith(check)) &&
    !notEnding.some((check) => value.endsWith(check))
	);
}
const WHITESPACE = [' ', '\t'];

const IdentityForm = ({ className, address, txFee, name, socials, onChangeName, onChangeSocials, setTxFee, startLoading, onCancel, perSocialBondFee, changeStep, closeModal }: Props) => {

	const [ form ] = Form.useForm();
	const { network } = useContext(NetworkContext);
	const { bondFee, gasFee, registerarFee } = txFee;
	const unit = `${chainProperties[network]?.tokenSymbol}`;
	const [hideDetails, setHideDetails] = useState<boolean>(false);
	const { api, apiReady } = useContext(ApiContext);
	const [{ info, okAll }, setInfo] = useState<ValueState>({ info: {}, okAll: false });
	const { displayName, legalName } = name;
	const { email, twitter } = socials;
	const [open, setOpen] = useState<boolean>(false);

	const getGasFee = async() => {
		if(!api || !apiReady || displayName.length === 0) return;

		startLoading(true);

		const tx = api.tx.identity.setIdentity({ info });
		const paymentInfo = await tx.paymentInfo(address);
		setTxFee({ ...txFee, gasFee: paymentInfo.partialFee  });
		startLoading(false);
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const getGasFeeFn = useCallback(_.debounce(getGasFee, 5000), [name, socials]);

	const handleInfo = () => {
		const displayNameVal = form.getFieldValue('displayName');
		const legalNameVal = form.getFieldValue('legalName');
		const emailVal = form.getFieldValue('email');
		const twitterVal = form.getFieldValue('twitter');
		console.log(displayNameVal);

		const okDisplay = checkValue((displayNameVal).length > 0, (displayNameVal) , 1, [], [], []);
		const okLegal = checkValue((legalNameVal).length > 0, (legalNameVal), 1, [], [], []);
		const okEmail = checkValue((emailVal).length > 0, (emailVal), 3, ['@'], WHITESPACE, []);
		// const okRiot = checkValue((riotVal || riot).length > 0, (riotVal || riot), 6, [':'], WHITESPACE, ['@', '~']);
		const okTwitter = checkValue((twitterVal).length > 0, (twitterVal), 3, [], WHITESPACE, ['@']);
		// const okWeb = checkValue((webVal || web).length > 0, (webVal || web), 8, ['.'], WHITESPACE, ['https://', 'http://']);

		let okSocials = 1;
		if(okEmail && (emailVal || email).length > 0){okSocials  +=1 ;}
		// if(okRiot && (riotVal || riot).length > 0){okSocials+=1;}
		if(okTwitter && (twitterVal || twitter).length > 0){okSocials+=1;}
		// if(okWeb && (webVal || web).length > 0){okSocials+=1;}
		console.log(okDisplay,okEmail);

		setInfo({
			info: {
				display: { [okDisplay ? 'raw' : 'none']: (displayNameVal || displayName) || null },
				email: { [(okEmail && (emailVal || email).length > 0) ? 'raw' : 'none']: (okEmail && (emailVal || email).length > 0) ? (emailVal || email) : null },
				legal: { [(okLegal && (legalNameVal || legalName).length > 0) ? 'raw' : 'none']: (okLegal && (legalNameVal || legalName).length > 0) ? (legalNameVal || legalName) : null },
				// riot: { [(okRiot && (riotVal || riot).length > 0) ? 'raw' : 'none']: (okRiot && (riotVal || riot).length > 0) ? (riotVal || riot) : null },
				twitter: { [(okTwitter && (twitterVal || twitter).length > 0 )? 'raw' : 'none']: (okTwitter && (twitterVal || twitter).length > 0) ? (twitterVal || twitter) : null }
				// web: { [(okWeb && (webVal || web).length > 0) ? 'raw' : 'none']: (okWeb && (webVal || web).length > 0) ? (webVal || web) : null }
			},
			okAll: okDisplay && okEmail && okLegal && okTwitter && (displayNameVal.length > 1)
		});
		const okSocialsBN = new BN((okSocials - 1) || BN_ONE);
		setTxFee({ ...txFee, bondFee: okSocials === 1 ? ZERO_BN : perSocialBondFee.mul(okSocialsBN) });
	};

	useEffect(() => {
		getGasFeeFn();
	},[getGasFeeFn]);

	return <div className={className}>
		<Form
			form={form}
			initialValues={{ displayName, email, legalName, twitter }}>
			<label className='text-sm text-lightBlue'>Your Address <HelperTooltip className='ml-1' text='your address.'/></label>
			<div className='px-[6px] py-[6px] mt-0.5 border-solid rounded-[4px] border-[1px] cursor-not-allowed h-[40px]  bg-[#f6f7f9] border-[#D2D8E0] text-[#7c899b] text-sm font-normal'>
				<Address address={address} identiconSize={26} disableAddressClick textClassName='text-bodyBlue' addressClassName='text-bodyBlue text-sm' displayInline />
			</div>
			<div className='mt-6'>
				<label className='text-sm text-lightBlue'>Display Name <span className='text-[#FF3C5F]'>*</span></label>
				<Form.Item name='displayName' rules={[{
					message: 'Invalid ',
					validator(rule, value, callback) {
						if (callback && value.length && !checkValue(displayName.length > 0, displayName , 1, [], [], []) ){
							callback(rule?.message?.toString());
						}else {
							callback();
						}
					} }]}>
					<Input
						name='displayName'
						className='h-[40px]
          rounded-[4px] text-bodyBlue mt-0.5'
						placeholder='Enter a name for your identity '
						value={displayName} onChange={(e) => {
							onChangeName({ ...name, displayName: e.target.value });
							handleInfo();
						}
						} />
				</Form.Item>
			</div>
			<div className='mt-6'>
				<label className='text-sm text-lightBlue'>Legal Name</label>
				<Form.Item name='legalName' rules={[{
					message: 'Invalid ',
					validator(rule, value, callback) {
						if (callback && value.length && !checkValue(legalName.length > 0, legalName, 1, [], [], [])){
							callback(rule?.message?.toString());
						}else {
							callback();
						}
					} }]}>
					<Input
						name='legalName'
						className='h-[40px] rounded-[4px] text-bodyBlue'
						placeholder='Enter your full name'
						value={legalName}
						onChange={(e) => {
							onChangeName({ ...name, legalName: e.target.value });
							handleInfo();
						}
						} />
				</Form.Item>
			</div>
			<Divider/>
			<div>
				<label className='text-sm font-medium text-lightBlue'>Socials <HelperTooltip className='ml-1' text='your address.'/></label>

				{/* <div className='flex items-center mt-4'>
					<span className='flex gap-2 w-[150px] items-center mb-6'>
						<WebIcon className='bg-[#edeff3] rounded-full text-2xl p-2.5'/>
						<span className='text-sm text-lightBlue'>Web</span>
					</span>
					<Form.Item className='w-full' name='web' rules={[{
						message: 'Invalid web',
						validator(rule, value, callback) {
							if (callback && value.length && !checkValue(web.length > 0, web, 8, ['.'], WHITESPACE, ['https://', 'http://']) ){
								callback(rule?.message?.toString());
							}else {
								callback();
							}
						} }]}>
						<Input name='web' value={web} placeholder='Enter your website address' className='h-[40px] rounded-[4px] text-bodyBlue' onChange={(e) => {onChangeSocials({ ...socials, web: e.target.value }); handleInfo({ webVal: e.target.value });}}/>
					</Form.Item>
				</div> */}

				<div className='flex items-center mt-1  '>
					<span className='flex gap-2 items-center w-[150px] mb-6' >
						<EmailIcon className='bg-[#edeff3] rounded-full text-xl p-2.5 text-[#576D8B]'/>
						<span className='text-sm text-lightBlue'>Email</span>
					</span>
					<Form.Item name='email' className='w-full'  rules={[{
						message: 'Invalid email',
						validator(rule, value, callback) {
							if (callback && value.length > 0 && !checkValue(email.length > 0, email, 3, ['@'], WHITESPACE, []) ){
								callback(rule?.message?.toString());
							}else {
								callback();
							}
						} }]}>
						<Input
							name='email'
							value={email}
							placeholder='Enter your email address'
							className='h-[40px] rounded-[4px] text-bodyBlue'
							onChange={(e) => {
								onChangeSocials({ ...socials, email: e.target.value });
								handleInfo();
							}
							}/>
					</Form.Item>
				</div>

				<div className='flex items-center mt-1'>
					<span className='flex gap-2 items-center w-[150px] mb-6'>
						<TwitterIcon className='bg-[#edeff3] rounded-full text-xl p-2.5 text-[#576D8B]'/>
						<span className='text-sm text-lightBlue'>Twitter</span></span>
					<Form.Item name='twitter' className='w-full' rules={[{
						message: 'Invalid twitter',
						validator(rule, value, callback) {
							if (callback && value.length && !checkValue(twitter.length > 0, twitter, 3, [], WHITESPACE, ['@']) ){
								callback(rule?.message?.toString());
							}else {
								callback();
							}
						} }]}>

						<Input
							name='twitter'
							value={twitter}
							placeholder='@YourTwitterName'
							className='h-[40px] rounded-[4px] text-bodyBlue'
							onChange={(e) => {
								onChangeSocials({ ...socials, twitter: e.target.value });
								handleInfo();
							}
							}/>
					</Form.Item>
				</div>

				{/* <div className='flex items-center mt-1'>
					<span className='flex gap-2 items-center w-[150px] mb-6'>
						<RiotIcon className='bg-[#edeff3] rounded-full text-xl p-2.5 text-[#576D8B]'/>
						<span className='text-sm text-lightBlue'>Riot</span>
					</span>
					<Form.Item name='riot' className='w-full' rules={[{
						message: 'Invalid riot',
						validator(rule, value, callback) {
							if (callback && value.length && !checkValue(riot.length > 0, riot, 6, [':'], WHITESPACE, ['@', '~']) ){
								callback(rule?.message?.toString());
							}else {
								callback();
							}
						} }]}>
						<Input name='riot' value={riot} placeholder='@Yourname.matrix.org' className='h-[40px] rounded-[4px] text-bodyBlue' onChange={(e) => {onChangeSocials({ ...socials, riot: e.target.value }); handleInfo({ riotVal: e.target.value });}}/>
					</Form.Item>
				</div> */}
			</div>
		</Form>
		<div className='flex gap-4 text-sm mt-6 items-center'>
			<span className='text-lightBlue font-medium'>Bond <HelperTooltip className='ml-1' text='your address.'/></span>
			<span className='text-bodyBlue font-medium bg-[#EDEFF3] py-1 px-3 rounded-2xl'>{formatedBalance(bondFee.toString(), unit)} {unit}</span>
		</div>

		{!gasFee.eq(ZERO_BN) && <Alert
			className='mt-6 rounded-[4px]'
			type='info'
			showIcon
			message={<span className='text-bodyBlue text-sm font-medium '>Total Fees of {formatedBalance((bondFee.add(gasFee).add(registerarFee)).toString(), unit)} {unit} will be applied to the transaction.<span className='text-pink_primary text-xs cursor-pointer ml-1' onClick={() => setHideDetails(!hideDetails)}>{hideDetails ? 'Show Details' : 'Hide Details'}</span></span>}
			description={hideDetails ? '' : <div className='flex gap-1 flex-col text-sm mr-[18px]'>
				<span className='flex justify-between text-xs'>
					<span className='text-lightBlue'>Gas Fee</span>
					<span className='text-bodyBlue font-medium'>{formatedBalance(gasFee.toString(), unit)} {unit}</span>
				</span>
				<span className='flex justify-between text-xs'>
					<span className='text-lightBlue'>Registrar fees</span>
					<span className='text-bodyBlue font-medium'>{formatedBalance(registerarFee.toString(), unit)} {unit}</span>
				</span>
				<span className='flex justify-between text-xs'>
					<span className='text-lightBlue'>Total</span>
					<span className='text-bodyBlue font-medium'>{formatedBalance(registerarFee.add(gasFee).toString(), unit)} {unit}</span>
				</span>
			</div>}
		/>}
		<div className='-mx-6 mt-6 border-0 border-solid flex justify-end border-t-[1px] gap-4 px-6 pt-5 border-[#E1E6EB] rounded-[4px]'>
			<Button onClick={onCancel} className='border-pink_primary text-sm border-[1px]  h-[40px] rounded-[4px] w-[134px] text-pink_primary tracking-wide'>
               Cancel
			</Button>
			<Button
				disabled={!okAll}
				className={`bg-pink_primary text-sm rounded-[4px] h-[40px] w-[134px] text-white tracking-wide ${(!okAll) && 'opacity-50'}`}
				onClick={() => {closeModal(true); setOpen(true);}}>
                  Set Identity
			</Button>
		</div>
		<SuccessState open={open} close={(close) => setOpen(!close)} openPreModal={(pre) => closeModal(!pre)} changeStep={changeStep} txFee={txFee} name={name} address={address} socials={socials} />

	</div>;
};

export default styled(IdentityForm)`
.ant-alert-with-description .ant-alert-icon{
  font-size: 14px !important;
  margin-top: 5px;
}
.ant-alert{
  padding: 12px;
}
input::placeholder {
	font-weight: 400 !important;
	font-size: 14px !important;
	line-height: 21px !important;
	letter-spacing: 0.0025em !important;
  color: #798aa2 !important;
}
`;