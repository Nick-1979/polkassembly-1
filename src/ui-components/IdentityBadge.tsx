// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { DeriveAccountFlags, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import EmailIcon from '~assets/icons/email-icon.svg';
import LegalIcon from '~assets/icons/legal-icon.svg';
import JudgementIcon from '~assets/icons/judgement-icon.svg';
import TwitterIcon from '~assets/icons/twitter-icon.svg';
import WebIcon from '~assets/icons/web-icon.svg';
import RiotIcon from '~assets/icons/riot-icon.svg';
import ShareScreenIcon from '~assets/icons/screen-share-icon.svg';
import PgpIcon from '~assets/icons/pgp-icon.svg';

interface Props {
	className?: string,
	address: string,
	identity?: DeriveAccountRegistration | null,
	flags?: DeriveAccountFlags,
	web3Name?: string
}

const StyledPopup = styled.div`
font-size: sm;
list-style: none;
padding: 1rem;

li {
	margin-bottom: 0.3rem;
}

.desc {
	font-weight: 500;
	margin-right: 0.3rem;
}

.judgments {
	display: inline list-item;
}
`;

const IdentityBadge = ({ className, address, identity, flags, web3Name }: Props) => {
	const judgements = identity?.judgements.filter(([, judgement]): boolean => !judgement.isFeePaid);
	const isGood = judgements?.some(([, judgement]): boolean => judgement.isKnownGood || judgement.isReasonable);
	const isBad = judgements?.some(([, judgement]): boolean => judgement.isErroneous || judgement.isLowQuality);

	const color: 'brown' | 'green' | 'grey' = isGood ? 'green' : isBad ? 'brown' : 'grey';
	const CouncilEmoji = () => <span aria-label="council member" className='-mt-1' role="img">👑</span>;
	const infoElem = <span className='flex items-center'>
		{isGood ? <CheckCircleFilled style={ { color } } /> : <MinusCircleFilled style={ { color } } />}
		<span className='w-1'></span>
		{flags?.isCouncil && <CouncilEmoji/>}
	</span>;

	const displayJudgements = JSON.stringify(judgements?.map(([,jud]) => jud.toString()));
	const popupContent =
	<StyledPopup>
		{identity?.legal &&
		<li className='flex items-center'>
			<span className='desc text-blue-light-high dark:text-blue-dark-high font-medium flex items-center text-sm'>
				<LegalIcon className='mr-1.5'/>legal:
			</span>
			<span className='text-xs text-blue-light-high dark:text-blue-dark-high font-normal truncate pt-0.5'>{identity.legal}</span>
		</li>
		}
		{identity?.email &&
		<li className='flex items-center'>
			<span className='desc text-blue-light-high dark:text-blue-dark-high font-medium flex items-center text-sm'>
				<EmailIcon className='mr-2'/>Email:
			</span>
			<span className='text-xs text-blue-light-high dark:text-blue-dark-high font-normal truncate pt-0.5'>{identity.email}</span>
		</li>
		}
		{(identity?.judgements?.length || 0) > 0 &&
		<li className='flex items-center'>
			<span className='desc flex items-center text-sm text-blue-light-high dark:text-blue-dark-high font-medium'><JudgementIcon className='mr-1.5'/>Judgements:</span>
			<span className='text-xs truncate text-blue-light-high dark:text-blue-dark-high'>{displayJudgements}</span>
		</li>
		}
		{identity?.pgp &&
		<li className='flex items-center'>
			<span className='desc flex items-center text-sm text-blue-light-high dark:text-blue-dark-high font-medium'><PgpIcon className='mr-1'/>pgp:</span>
			<span className='text-xs text-bodyblue truncate font-normal'>{identity.pgp}</span>
		</li>
		}
		{identity?.riot &&
		<li className='flex items-center'>
			<span className='desc flex items-center text-sm text-blue-light-high dark:text-blue-dark-high font-medium'><RiotIcon className='mr-1.5' />riot: </span>
			<span className='text-xs text-blue-light-high dark:text-blue-dark-high truncate font-normal'>{identity.riot}</span>
		</li>
		}
		{identity?.twitter &&
		<li className='flex items-center'>
			<span className='desc text-blue-light-high dark:text-blue-dark-high font-medium flex text-sm'><TwitterIcon className='mr-1.5 mt-1'/>Twitter: </span>
			<span className='text-xs font-normal truncate text-blue-light-high dark:text-blue-dark-high'>{identity.twitter}</span>
		</li>
		}
		{identity?.web &&
		<li className='flex items-center'>
			<span className='desc text-blue-light-high dark:text-blue-dark-high font-medium flex text-sm'><WebIcon className='mr-1.5 mt-1 -ml-0.5' />Web: </span>
			<span className='text-xs text-blue-light-high dark:text-blue-dark-high truncate font-normal pt-0.5'>{identity.web}</span>
		</li>
		}
		{flags?.isCouncil &&
		<li className='flex items-center'>
			<span className='desc text-blue-light-high dark:text-blue-dark-high font-medium text-sm'><CouncilEmoji /> Council member </span>
		</li>
		}
		{
			<li className='flex items-center'>
				<span className='desc'><a href={`https://polkaverse.com/accounts/${address}`} target='_blank' rel='noreferrer' className='flex text-pink-500 underline items-center'><ShareScreenIcon className='mr-2'/>Polkaverse Profile</a>
				</span>
			</li>
		}
		{web3Name &&
		<li className='flex items-center'>
			<span className='desc flex items-center'><a href={`https://w3n.id/${web3Name}`} target='_blank' rel='noreferrer' className='flex text-pink-500'><ShareScreenIcon className='mr-2'/>Web3 Name Profile</a>
			</span>
		</li>
		}
	</StyledPopup>;

	return <div className={className}>
		<Tooltip color='#fff' title={popupContent}>
			{infoElem}
		</Tooltip>
	</div>;
};

export default styled(IdentityBadge)`
	i.green.circle.icon {
		color: green_primary !important;
	}

	i.grey.circle.icon {
		color: grey_primary !important;
	}
`;
