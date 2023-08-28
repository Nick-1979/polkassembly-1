// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Result } from 'antd';
import Link from 'next/link';
import React, { FC } from 'react';

import NothingFoundSVG from '~assets/nothing-found.svg';

interface IFallbackProps {
	onReset: () => void;
}

const Fallback: FC<IFallbackProps> = (props) => {
	return (
		<section className='absolute inset-0 z-[9999999] bg-[#F5F6F8] flex flex-col items-center justify-center h-screen w-screen'>
			<Result
				icon={
					<div className='w-1/2 h-auto mx-auto max-w-[900px]'>
						<NothingFoundSVG />
					</div>
				}
				title="Unfortunately something has gone wrong. Please try again."
				extra={
					<Link onClick={props.onReset} href='/' className='py-2 px-6 bg-pink_primary text-white border-white hover:bg-pink_secondary rounded-md text-lg h-[50px] w-[215px]'>
						Go To Home
					</Link>
				}
			/>
		</section>
	);
};

export default Fallback;