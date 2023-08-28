// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { Button, Form, FormInstance, Select } from 'antd';
import BalanceInput from '~src/ui-components/BalanceInput';
import { ReactNode } from 'react-markdown/lib/ast-to-react';
import DownIcon from '~assets/icons/down-icon.svg';
import BN from 'bn.js';

export enum EFormType{
  AYE_NAY_FORM = 'aye-nay-form',
  SPLIT_FORM = 'split-form',
  ABSTAIN_FORM = 'abstain-form'
}
interface Props{
  convictionClassName?:string;
  formName: EFormType;
  form: FormInstance<any>;
  onBalanceChange: (pre: BN)=>void;
  onAyeValueChange?: (pre: BN)=>void;
  onNayValueChange?: (pre: BN)=>void;
  onAbstainValueChange?:(pre: BN)=>void;
  handleSubmit:()=> void;
  disabled: boolean;
  conviction:number;
  setConviction:(pre:number)=> void;
  convictionOpts: ReactNode;
}

const VotingForm = ({ form, formName, handleSubmit, disabled, onBalanceChange, onAyeValueChange, onNayValueChange, onAbstainValueChange, convictionOpts, conviction, setConviction, convictionClassName }: Props) => {

	const ConvictionSelect = ({ className }: { className?:string }) =>

		<Form.Item className={className}>
			<label  className='inner-headings'>
          Vote lock
			</label>
			<Select onChange={(key) => setConviction(Number(key))} size='large' className='' defaultValue={conviction} suffixIcon ={<DownIcon/>}>
				{convictionOpts}
			</Select>

		</Form.Item>;

	return <Form
		form={form}
		name={formName}
		onFinish={handleSubmit}
		style={{ maxWidth: 600  }}
	>
		{[EFormType.ABSTAIN_FORM].includes(formName) && <BalanceInput
			label={'Abstain vote value'}
			placeholder={'Add balance'}
			onChange={(balance:BN) => onAbstainValueChange?.(balance)}
			className='text-sm font-medium'
			formItemName={'abstainVote'}
		/>}

		{
			[EFormType.ABSTAIN_FORM, EFormType.SPLIT_FORM].includes(formName) && <>
				<BalanceInput
					label={'Aye vote value'}
					placeholder={'Add balance'}
					onChange={(balance:BN) => onAyeValueChange?.(balance)}
					className='text-sm font-medium'
					formItemName={'ayeVote'}
				/>

				<BalanceInput
					label={'Nay vote value'}
					placeholder={'Add balance'}
					onChange={(balance:BN) => onNayValueChange?.(balance)}
					className='text-sm font-medium'
					formItemName={'nayVote'}
				/>
			</>}
		{[EFormType.AYE_NAY_FORM].includes(formName) && <>
			<BalanceInput
				label={'Lock balance'}
				helpText={'Amount of you are willing to lock for this vote.'}
				placeholder={'Add balance'}
				onChange={onBalanceChange}
				className='text-sm font-medium border-[#D2D8E0]'
				formItemName='balance'
			/>
			<ConvictionSelect className={`${convictionClassName}`} />
		</>
		}
		<div className='flex justify-end mt-[-1px] pt-5 -mr-6 -ml-6 border-0 border-solid border-t-[1px] border-[#D2D8E0]'>
			<Button className={`w-[134px] h-[40px] rounded-[4px] text-[white] bg-pink_primary mr-[24px] font-semibold border-0 ${disabled && 'opacity-50'}`} htmlType='submit' disabled={disabled}>Confirm</Button>
		</div>
	</Form>;
};
export default VotingForm;