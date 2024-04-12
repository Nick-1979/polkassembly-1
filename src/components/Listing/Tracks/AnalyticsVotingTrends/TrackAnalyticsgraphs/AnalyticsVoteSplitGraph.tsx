// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */

import { ResponsiveBar } from '@nivo/bar';
import { Card } from 'antd';
import { useTheme } from 'next-themes';
import React from 'react';
import styled from 'styled-components';
import { useNetworkSelector } from '~src/redux/selectors';
import formatBnBalance from '~src/util/formatBnBalance';
import BN from 'bn.js';
import formatUSDWithUnits from '~src/util/formatUSDWithUnits';
import { chainProperties } from '~src/global/networkConstants';

const ZERO = new BN(0);
interface IProps {
	votesSplitData: { abstain: string | number; aye: string | number; nay: string | number; index: number }[];
	isUsedInAccounts?: boolean;
}

const StyledCard = styled(Card)`
	g[transform='translate(0,0)'] g:nth-child(even) {
		display: none !important;
	}
	div[style*='pointer-events: none;'] {
		visibility: hidden;
		animation: fadeIn 0.5s forwards;
	}

	@keyframes fadeIn {
		0% {
			visibility: hidden;
			opacity: 0;
		}
		100% {
			visibility: visible;
			opacity: 1;
		}
	}
`;

const AnalyticsVoteSplitGraph = ({ votesSplitData, isUsedInAccounts }: IProps) => {
	const { network } = useNetworkSelector();
	const { resolvedTheme: theme } = useTheme();

	const bnToIntBalance = (bnValue: string | number | BN): number => {
		const bn = BN.isBN(bnValue) ? bnValue : new BN(bnValue.toString());
		return Number(formatBnBalance(bn, { numberAfterComma: 6, withThousandDelimitor: false }, network));
	};

	const data = votesSplitData.map((item) => ({
		abstain: item.abstain,
		aye: item.aye,
		index: item.index,
		nay: item.nay
	}));

	const colors: { [key: string]: string } = {
		abstain: theme === 'dark' ? '#407BFF' : '#407BFF',
		aye: theme === 'dark' ? '#64A057' : '#2ED47A',
		nay: theme === 'dark' ? '#BD2020' : '#E84865'
	};

	const chartData = votesSplitData.map((item) => {
		return {
			abstain: bnToIntBalance(item.abstain || ZERO) || 0,
			aye: bnToIntBalance(item.aye || ZERO) || 0,
			nay: bnToIntBalance(item.nay || ZERO) || 0,
			index: item.index
		};
	});

	return (
		<StyledCard className='mx-auto max-h-[500px] w-full flex-1 rounded-xxl border-[#D2D8E0] bg-white p-0 text-blue-light-high dark:border-[#3B444F] dark:bg-section-dark-overlay dark:text-white'>
			<h2 className='text-xl font-semibold'>Vote Split</h2>
			<div className='h-[260px]'>
				<ResponsiveBar
					data={isUsedInAccounts ? data : chartData}
					keys={['aye', 'nay', 'abstain']}
					indexBy='index'
					margin={{ bottom: 50, left: 50, right: 10, top: 10 }}
					padding={0.5}
					valueScale={{ type: 'linear' }}
					borderRadius={3}
					colors={(bar) => colors[bar.id]}
					defs={[
						{ id: 'dots', type: 'patternDots', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', size: 4, padding: 1, stagger: true },
						{ id: 'lines', type: 'patternLines', background: 'inherit', color: 'rgba(255, 255, 255, 0.3)', rotation: -45, lineWidth: 6, spacing: 10 }
					]}
					borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						tickPadding: 5,
						tickRotation: 0,
						tickSize: 5,
						truncateTickAt: 0
					}}
					axisLeft={{
						format: (value) => formatUSDWithUnits(value, 1),
						tickPadding: 5,
						tickRotation: 0,
						tickSize: 5,
						truncateTickAt: 0
					}}
					labelSkipWidth={6}
					labelSkipHeight={12}
					enableLabel={false}
					labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
					legends={[
						{
							anchor: 'bottom',
							dataFrom: 'keys',
							direction: 'row',
							effects: [
								{
									on: 'hover',
									style: {
										itemOpacity: 1
									}
								}
							],
							itemDirection: 'left-to-right',
							itemHeight: 20,
							itemOpacity: 0.85,
							itemTextColor: theme === 'dark' ? '#747474' : '#576D8B',
							itemWidth: 50,
							itemsSpacing: 2,
							justify: false,
							symbolShape: 'circle',
							symbolSize: 6,
							translateX: -20,
							translateY: 50
						}
					]}
					role='application'
					theme={{
						axis: {
							domain: {
								line: {
									stroke: 'transparent',
									strokeWidth: 1
								}
							},
							ticks: {
								line: {
									stroke: 'transparent'
								},
								text: {
									fill: theme === 'dark' ? '#fff' : '#576D8B',
									fontSize: 11,
									outlineColor: 'transparent',
									outlineWidth: 0
								}
							}
						},
						grid: {
							line: {
								stroke: theme === 'dark' ? '#3B444F' : '#D2D8E0',
								strokeDasharray: '2 2',
								strokeWidth: 1
							}
						},
						legends: {
							text: {
								fontSize: 12,
								textTransform: 'capitalize'
							}
						},
						tooltip: {
							container: {
								background: theme === 'dark' ? '#1E2126' : '#fff',
								color: theme === 'dark' ? '#fff' : '#576D8B',
								fontSize: 11,
								textTransform: 'capitalize'
							}
						}
					}}
					animate={true}
					groupMode='stacked'
					valueFormat={(value) => `${formatUSDWithUnits(value.toString(), 1)}  ${isUsedInAccounts ? 'voters' : chainProperties[network]?.tokenSymbol}`}
				/>
			</div>
		</StyledCard>
	);
};

export default AnalyticsVoteSplitGraph;
