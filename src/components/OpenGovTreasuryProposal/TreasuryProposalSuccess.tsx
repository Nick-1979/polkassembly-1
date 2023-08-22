// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'antd';
import { poppins } from 'pages/_app';
import BN from 'bn.js';
import { useNetworkContext } from '~src/context';
import Address from '~src/ui-components/Address';
import { formatBalance } from '@polkadot/util';
import { chainProperties } from '~src/global/networkConstants';
import { networkTrackInfo } from '~src/global/post_trackInfo';
import { formatedBalance } from '~src/util/formatedBalance';
import styled from 'styled-components';
import { blocksToRelevantTime, getTrackData } from '../Listing/Tracks/AboutTrackCard';
import CloseIcon from '~assets/icons/close.svg';
import SuccessIcon from '~assets/delegation-tracks/success-delegate.svg';
import Link from 'next/link';

interface Props{
  className?: string;
   open: boolean;
  onCancel: () => void;
  proposerAddress: string;
  fundingAmount: BN;
  selectedTrack: string;
  preimageHash: string;
  preimageLength: number | null;
  beneficiaryAddress: string;
  postId: number;
}

const getDefaultTrackMetaData = () => {
	return {
		confirmPeriod: '',
		decisionDeposit: '',
		decisionPeriod: '',
		description: '',
		group: '',
		maxDeciding: '',
		minEnactmentPeriod: '',
		preparePeriod: '',
		trackId: 0
	};
};

const TreasuryProposalSuccessPopup= ({ className, open, onCancel, fundingAmount, preimageHash, proposerAddress, beneficiaryAddress, preimageLength, selectedTrack, postId }: Props) => {

	const { network } = useNetworkContext();
	const unit =`${chainProperties[network]?.tokenSymbol}`;
	const [trackMetaData, setTrackMetaData] = useState(getDefaultTrackMetaData());

	useEffect(() => {
		setTrackMetaData(getTrackData(network, selectedTrack));
	}, [network, selectedTrack]);

	useEffect(() => {
		if(!network) return ;
		formatBalance.setDefaults({
			decimals: chainProperties[network].tokenDecimals,
			unit: chainProperties[network].tokenSymbol
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Modal
		open={open}
		className={`${poppins.variable} ${poppins.className} w-[550px] max-md:w-full`}
		wrapClassName={className}
		closeIcon={<CloseIcon/>}
		onCancel={onCancel}
		footer={
			<Link href={`https://${network}.polkassembly.io/referenda/${postId}`} className='flex items-center'>
				<Button className='w-full bg-pink_primary text-white text-sm font-medium h-[40px] rounded-[4px]'>View Proposal</Button>
			</Link>
		}
		maskClosable={false}
	>
		<div className='flex justify-center items-center flex-col -mt-[132px]'>
			<SuccessIcon/>
			<label className='text-xl text-blue-light-high dark:text-blue-dark-high font-semibold'>Proposal created successfully for</label>
			{fundingAmount && <span className='text-2xl font-semibold text-pink_primary mt-2'>
				{formatedBalance(fundingAmount.toString(), unit)} {unit}
			</span>
			}
			{
				(proposerAddress && beneficiaryAddress && selectedTrack && preimageHash && preimageLength) && <div className='flex my-2'>
					<div className='mt-[10px] flex flex-col text-sm text-lightBlue gap-1.5'>
						<span className='flex'><span className='w-[172px]'>Proposer Address:</span>
							<Address disableAddressClick addressClassName='text-blue-light-high dark:text-blue-dark-high font-semibold text-sm'  address={proposerAddress} identiconSize={18}/>
						</span>
						<span className='flex'>
							<span className='w-[172px]'>Beneficiary Address:</span>
							<Address disableAddressClick textClassName='text-blue-light-high dark:text-blue-dark-high font-medium text-sm' displayInline address={beneficiaryAddress} identiconSize={18}/>
						</span>

						<span className='flex'>
							<span className='w-[172px]'>Track:</span>
							<span className='text-blue-light-high dark:text-blue-dark-high font-medium'>{selectedTrack}
								<span className='text-pink_primary ml-1'>#{networkTrackInfo[network][selectedTrack]?.trackId || 0}</span>
							</span>
						</span>
						<span className='flex'><span className='w-[172px]'>Funding Amount:</span>
							<span className='text-blue-light-high dark:text-blue-dark-high font-medium'>{formatedBalance(fundingAmount.toString(), unit)} {unit}</span>
						</span>
						<span className='flex items-center'><span className='w-[172px]'>Preimage Hash:</span>
							<span className='text-blue-light-high dark:text-blue-dark-high  font-medium'>{preimageHash.slice(0,10)+'...'+ preimageHash.slice(55)}</span>
						</span>
						<span className='flex'>
							<span className='w-[172px]'>Preimage Length:</span>
							<span className='text-blue-light-high dark:text-blue-dark-high font-medium'>{preimageLength}</span>
						</span>
					</div>
				</div>}
			<Alert
				showIcon
				type='warning'
				className='rounded-[4px] m-2 text-sm w-full'
				message={<span className='text-sm font-medium text-blue-light-high dark:text-blue-dark-high'>
        Place a decision deposit in {blocksToRelevantTime(network, Number(trackMetaData.decisionPeriod + trackMetaData.preparePeriod))} to prevent your proposal from being timed out.
				</span>}
				description={
					<Link href={`https://${network}.polkassembly.io/referenda/${postId}`} className='text-xs text-pink_primary font-medium cursor-pointer'>
						Pay Decision Deposit
					</Link>}
			/>
		</div>

	</Modal>;
};

export default styled(TreasuryProposalSuccessPopup)`
.ant-alert-with-description{
	padding-block: 12px !important;
}
.ant-alert-with-description .ant-alert-description{
	margin-top:-10px ;
}
.ant-alert-with-description .ant-alert-icon{
	font-size: 18px !important;
	margin-top: 4px;
}`;
