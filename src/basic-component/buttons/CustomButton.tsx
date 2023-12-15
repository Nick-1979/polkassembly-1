// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC, PropsWithChildren, ReactNode } from 'react';
import { Button as ANTDButton } from 'antd';

interface ICustomButton {
	text?: string | ReactNode;
	disabled?: boolean;
	loading?: boolean;
	htmlType?: any;
	fontSize?: string;
	className?: string;
	onClick?: (pre?: any) => void;
	variant: 'primary' | 'default' | 'dashed' | 'link' | 'text';
	icon?: any;
	width?: number;
	height?: number;
	style?: any;
}
const CustomButton: FC<PropsWithChildren<ICustomButton>> = (props) => {
	const { style, text, disabled, loading, htmlType, className, onClick, variant, icon, width, height, fontSize } = props;
	return (
		<ANTDButton
			className={`${`h-[${height ? height : '40'}px]`} flex items-center justify-center gap-0 rounded-md ${fontSize ? `text-${fontSize}` : 'text-sm'} font-medium ${
				variant === 'primary'
					? 'border-pink_primary bg-pink_primary text-white hover:bg-pink_secondary dark:text-white'
					: 'border border-pink_primary bg-transparent text-pink_primary'
			} ${className} `}
			disabled={disabled}
			type={variant}
			loading={loading}
			htmlType={htmlType}
			onClick={onClick}
			icon={icon}
			size='large'
			style={{ height: `${height}px !important`, width: `${width}px !important`, ...style }}
		>
			{props.children || text}
		</ANTDButton>
	);
};

export default CustomButton;
