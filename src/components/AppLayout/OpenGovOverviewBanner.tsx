// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from 'react';
import { OpenGovBannerIcon } from '~src/ui-components/CustomIcons';
import { getTime } from './OpenGovHeaderBanner';
import Link from 'next/link';

const OpenGovOverviewBanner = () => {
	const [[days, hrs, mins, secs], setTime] = useState(getTime());
	useEffect(() => {
		const timer = setInterval(() => {
			setTime(() => {
				return getTime();
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);
	return (
		<div className='flex items-center h-full justify-center'>
			<section className='flex flex-col items-center justify-center relative md:mt-20 bg-[#FFF3FA] rounded-[24px] px-[21.5px] md:px-[53px] pb-[20.8px] md:pb-[33.66px] pt-[62.5px] md:pt-[102.34px]'>
				<div className='absolute bottom-56 md:bottom-96 lg:bottom-80 flex items-center justify-center'>
					<OpenGovBannerIcon className='text-[134px] md:text-[300px]' />
				</div>
				<h2 className='m-0 p-0 font-medium text-[18px] leading-[27px] md:text-[32px] md:leading-[48px] text-blue-light-high dark:text-blue-dark-high mb-3 md:mb-8 flex flex-col lg:flex-row items-center justify-center text-center gap-x-2'>
					<span>OpenGov expected to go live on</span> {' '} <span>Polkadot in</span>
				</h2>
				<div className='flex items-center justify-center gap-x-2 md:gap-x-[38px] opengov_banner px-[35px] py-[9px] md:px-[70px] md:py-[19px] rounded-[14px] md:rounded-[20px]'>
					<p className='m-0 flex flex-col justify-center items-center'>
						<span className='font-medium  text-6 leading-9 md:text-5xl md:leading-[72px] text-white'>{days}</span>
						<span className='font-medium text-xs leading-[18px] md:text-[18px] md:leading-[27px] text-[rgba(255,255,255,0.8)]'>
                            Days
						</span>
					</p>
					<span className='h-[46px] w-[0.75px] bg-[#D2D8E0] flex items-center justify-center'></span>
					<p className='m-0 flex flex-col justify-center items-center'>
						<span className='font-medium  text-6 leading-9 md:text-5xl md:leading-[72px] text-white'>{hrs}</span>
						<span className='font-medium text-xs leading-[18px] md:text-[18px] md:leading-[27px] text-[rgba(255,255,255,0.8)]'>
                            Hours
						</span>
					</p>
					<span className='h-[46px] w-[0.75px] bg-[#D2D8E0] flex items-center justify-center'></span>
					<p className='m-0 flex flex-col justify-center items-center'>
						<span className='font-medium  text-6 leading-9 md:text-5xl md:leading-[72px] text-white'>{mins}</span>
						<span className='font-medium text-xs leading-[18px] md:text-[18px] md:leading-[27px] text-[rgba(255,255,255,0.8)]'>
                            Minutes
						</span>
					</p>
					<span className='h-[46px] w-[0.75px] bg-[#D2D8E0] flex items-center justify-center'></span>
					<p className='m-0 flex flex-col justify-center items-center'>
						<span className='font-medium  text-6 leading-9 md:text-5xl md:leading-[72px] text-white'>{secs}</span>
						<span className='font-medium text-xs leading-[18px] md:text-[18px] md:leading-[27px] text-[rgba(255,255,255,0.8)]'>
                            Seconds
						</span>
					</p>
				</div>
				<div className='flex items-center gap-x-2 mt-4 md:mt-8 text-blue-light-high dark:text-blue-dark-high font-medium text-xs leading-[18px] md:text-2xl md:leading-[36px]'>
					<p className='m-0'>Vote on proposal </p>
					<Link href={'/referendum/121'} className='text-pink_primary'>
						here
					</Link>
				</div>
			</section>
		</div>
	);
};

export default OpenGovOverviewBanner;