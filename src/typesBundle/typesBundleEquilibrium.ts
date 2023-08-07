// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// SPDX-License-Identifier: Apache-2.0
// Do not edit, auto-generated by @polkadot/apps-config
import type { OverrideBundleType } from "@polkadot/types/types";
/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable sort-keys */
export const typesBundleEquilibrium = {
    spec: {
        equilibrium: {
            instances: {
                balances: ["Eq", "Eth", "Btc", "Eos", "Dot", "Crv", "Usd"]
            },
            types: [
                {
                    minmax: [0, 264],
                    types: {
                        AccountData: {
                            free: "Balance"
                        },
                        AccountIndex: "u32",
                        AccountInfo: {
                            nonce: "Index",
                            consumers: "RefCount",
                            providers: "RefCount",
                            sufficients: "RefCount",
                            data: "AccountData"
                        },
                        AccountType: {
                            _enum: {
                                Id32: "[u8; 32]",
                                Key20: "[u8; 20]"
                            }
                        },
                        Address: "MultiAddress",
                        Asset: {
                            "0": "AssetIdInnerType"
                        },
                        AssetData: {
                            id: "Asset",
                            lot: "FixedU128",
                            price_step: "FixedU128",
                            maker_fee: "FixedU128",
                            taker_fee: "FixedU128",
                            asset_xcm_data: "Option<AssetXcmData>",
                            debt_weight: "DebtWeightType",
                            buyout_priority: "u64",
                            asset_type: "AssetType",
                            is_dex_enabled: "bool"
                        },
                        AssetId: "Asset",
                        AssetIdInnerType: "u64",
                        AssetMetrics: {
                            period_start: "Duration",
                            period_end: "Duration",
                            returns: "Vec<FixedNumber>",
                            volatility: "FixedNumber",
                            correlations: "Vec<(Asset, FixedNumber)>"
                        },
                        AssetName: "Vec<u8>",
                        AssetType: {
                            _enum: {
                                Native: null,
                                Physical: null,
                                Synthetic: null,
                                Lp: "PoolId"
                            }
                        },
                        AssetXcmData: {
                            multi_location: "MultiLocation",
                            decimals: "u8"
                        },
                        Balance: "u64",
                        BalanceOf: "Balance",
                        BalancesAggregate: {
                            total_issuance: "Balance",
                            total_debt: "Balance"
                        },
                        BestPrice: {
                            ask: "Option<FixedI64>",
                            bid: "Option<FixedI64>"
                        },
                        BlockNumber: "u32",
                        CapVec: {
                            head_index: "u32",
                            len_cap: "u32",
                            items: "Vec<FixedNumber>"
                        },
                        ChainId: "u8",
                        Currency: {
                            _enum: [
                                "UNKNOWN",
                                "Eqd",
                                "Eq",
                                "Eth",
                                "Btc",
                                "Eos",
                                "Dot",
                                "Crv"
                            ]
                        },
                        ChunkKey: "u64",
                        DataPoint: {
                            price: "u64",
                            account_id: "AccountId",
                            block_number: "BlockNumber",
                            timestamp: "u64"
                        },
                        DebtWeightType: "i128",
                        DebtWeightTypeInner: "i128",
                        DepositNonce: "u64",
                        Duration: {
                            secs: "u64",
                            nanos: "u32"
                        },
                        FinancialMetrics: {
                            period_start: "Duration",
                            period_end: "Duration",
                            assets: "Vec<Asset>",
                            mean_returns: "Vec<FixedNumber>",
                            volatilities: "Vec<FixedNumber>",
                            correlations: "Vec<FixedNumber>",
                            covariances: "Vec<FixedNumber>"
                        },
                        FinancialRecalcPeriodMs: "u64",
                        FixedI64: "i64",
                        FixedNumber: "u128",
                        FixedU128: "u128",
                        Keys: "SessionKeys3",
                        LookupSource: "AccountIdLookup",
                        MarginState: {
                            _enum: {
                                Good: null,
                                SubGood: null,
                                MaintenanceStart: "u64",
                                MaintenanceIsGoing: "u64",
                                MaintenanceTimeOver: "u64",
                                MaintenanceEnd: null,
                                SubCritical: null
                            }
                        },
                        MaxCountOfAssetsRecalcPerBlock: "i32",
                        Number: "FixedU128",
                        OperationRequestLiqFm: {
                            authority_index: "AuthIndex",
                            validators_len: "u32",
                            block_num: "BlockNumber"
                        },
                        OperationRequest: {
                            account: "AccountId",
                            authority_index: "AuthIndex",
                            validators_len: "u32",
                            block_num: "BlockNumber"
                        },
                        OperationRequestDexDeleteOrder: {
                            asset: "Asset",
                            order_id: "OrderId",
                            price: "FixedI64",
                            who: "AccountId",
                            buyout: "Option<Balance>",
                            authority_index: "AuthIndex",
                            validators_len: "u32",
                            block_num: "BlockNumber"
                        },
                        Order: {
                            order_id: "OrderId",
                            account_id: "AccountId",
                            side: "OrderSide",
                            price: "FixedI64",
                            amount: "FixedU128",
                            created_at: "u64",
                            expiration_time: "u64"
                        },
                        OrderType: {
                            _enum: {
                                Limit: "FixedI64",
                                Market: null
                            }
                        },
                        OrderId: "u64",
                        OrderSide: {
                            _enum: ["Buy", "Sell"]
                        },
                        PoolId: "u32",
                        PoolInfo: {
                            owner: "AccountId",
                            pool_asset: "AssetId",
                            assets: "Vec<AssetId>",
                            amplification: "Number",
                            fee: "Permill",
                            admin_fee: "Permill",
                            balances: "Vec<Balance>",
                            total_balances: "Vec<Balance>"
                        },
                        PoolTokenIndex: "u32",
                        PortfolioMetrics: {
                            period_start: "Duration",
                            period_end: "Duration",
                            z_score: "u32",
                            volatility: "FixedNumber",
                            value_at_risk: "FixedNumber"
                        },
                        Price: "u128",
                        PriceLog: {
                            latest_timestamp: "Duration",
                            prices: "CapVec<Price>"
                        },
                        PricePayload: {
                            public: "[u8; 33]",
                            asset: "Asset",
                            price: "FixedI64",
                            block_number: "BlockNumber"
                        },
                        PricePeriod: {
                            _enum: ["Min", "TenMin", "Hour", "FourHour", "Day"]
                        },
                        PricePoint: {
                            block_number: "BlockNumber",
                            timestamp: "u64",
                            last_fin_recalc_timestamp: "Timestamp",
                            price: "u64",
                            data_points: "Vec<DataPoint>"
                        },
                        PriceUpdate: {
                            period_start: "Duration",
                            time: "Duration",
                            price: "FixedNumber"
                        },
                        ProposalStatus: {
                            _enum: ["Initiated", "Approved", "Rejected"]
                        },
                        ProposalVotes: {
                            votes_for: "Vec<AccountId>",
                            votes_against: "Vec<AccountId>",
                            status: "ProposalStatus",
                            expiry: "BlockNumber"
                        },
                        ResourceId: "[u8; 32]",
                        Signature: "u32",
                        SignedBalance: {
                            _enum: {
                                Positive: "Balance",
                                Negative: "Balance"
                            }
                        },
                        SubAccType: {
                            _enum: ["Bailsman", "Borrower", "Lender"]
                        },
                        Timestamp: "u64",
                        TotalAggregates: {
                            collateral: "Balance",
                            debt: "Balance"
                        },
                        TransferReason: {
                            _enum: [
                                "Common",
                                "InterestFee",
                                "MarginCall",
                                "LiquidityFarming",
                                "BailsmenRedistribution",
                                "TreasuryEqBuyout",
                                "TreasuryBuyEq",
                                "Subaccount",
                                "Lock",
                                "Unlock",
                                "Claim",
                                "CurveFeeWithdraw"
                            ]
                        },
                        UserGroup: {
                            _enum: [
                                "UNKNOWN",
                                "Balances",
                                "Bailsmen",
                                "Borrowers",
                                "Lenders"
                            ]
                        },
                        UnsignedPriorityPair: "(u64, u64)",
                        VestingInfo: {
                            locked: "Balance",
                            perBlock: "Balance",
                            startingBlock: "BlockNumber"
                        }
                    }
                },
                {
                    minmax: [265, null],
                    types: {
                        AccountData: {
                            free: "Balance"
                        },
                        AccountIndex: "u32",
                        AccountInfo: {
                            nonce: "Index",
                            consumers: "RefCount",
                            providers: "RefCount",
                            sufficients: "RefCount",
                            data: "AccountData"
                        },
                        AccountType: {
                            _enum: {
                                Id32: "[u8; 32]",
                                Key20: "[u8; 20]"
                            }
                        },
                        Address: "MultiAddress",
                        Asset: {
                            "0": "AssetIdInnerType"
                        },
                        AssetData: {
                            id: "Asset",
                            lot: "FixedU128",
                            price_step: "FixedU128",
                            maker_fee: "FixedU128",
                            taker_fee: "FixedU128",
                            asset_xcm_data: "Option<AssetXcmData>",
                            debt_weight: "DebtWeightType",
                            buyout_priority: "u64",
                            asset_type: "AssetType",
                            is_dex_enabled: "bool"
                        },
                        AssetId: "Asset",
                        AssetIdInnerType: "u64",
                        AssetMetrics: {
                            period_start: "Duration",
                            period_end: "Duration",
                            returns: "Vec<FixedNumber>",
                            volatility: "FixedNumber",
                            correlations: "Vec<(Asset, FixedNumber)>"
                        },
                        AssetName: "Vec<u8>",
                        AssetType: {
                            _enum: {
                                Native: null,
                                Physical: null,
                                Synthetic: null,
                                Lp: "PoolId"
                            }
                        },
                        AssetXcmData: {
                            multi_location: "MultiLocation",
                            decimals: "u8"
                        },
                        Balance: "u64",
                        BalanceOf: "Balance",
                        BalancesAggregate: {
                            total_issuance: "Balance",
                            total_debt: "Balance"
                        },
                        BestPrice: {
                            ask: "Option<FixedI64>",
                            bid: "Option<FixedI64>"
                        },
                        BlockNumber: "u32",
                        CapVec: {
                            head_index: "u32",
                            len_cap: "u32",
                            items: "Vec<FixedNumber>"
                        },
                        ChainId: "u8",
                        Currency: {
                            _enum: [
                                "UNKNOWN",
                                "Eqd",
                                "Eq",
                                "Eth",
                                "Btc",
                                "Eos",
                                "Dot",
                                "Crv"
                            ]
                        },
                        ChunkKey: "u64",
                        DataPoint: {
                            price: "u64",
                            account_id: "AccountId",
                            block_number: "BlockNumber",
                            timestamp: "u64"
                        },
                        DebtWeightType: "i128",
                        DebtWeightTypeInner: "i128",
                        DepositNonce: "u64",
                        Duration: {
                            secs: "u64",
                            nanos: "u32"
                        },
                        FinancialMetrics: {
                            period_start: "Duration",
                            period_end: "Duration",
                            assets: "Vec<Asset>",
                            mean_returns: "Vec<FixedNumber>",
                            volatilities: "Vec<FixedNumber>",
                            correlations: "Vec<FixedNumber>",
                            covariances: "Vec<FixedNumber>"
                        },
                        FinancialRecalcPeriodMs: "u64",
                        FixedI64: "i64",
                        FixedNumber: "u128",
                        FixedU128: "u128",
                        Keys: "SessionKeys3",
                        LookupSource: "AccountIdLookup",
                        MarginState: {
                            _enum: {
                                Good: null,
                                SubGood: null,
                                MaintenanceStart: "u64",
                                MaintenanceIsGoing: "u64",
                                MaintenanceTimeOver: "u64",
                                MaintenanceEnd: null,
                                SubCritical: null
                            }
                        },
                        MaxCountOfAssetsRecalcPerBlock: "i32",
                        Number: "FixedU128",
                        OperationRequestLiqFm: {
                            authority_index: "AuthIndex",
                            validators_len: "u32",
                            block_num: "BlockNumber"
                        },
                        OperationRequest: {
                            account: "AccountId",
                            authority_index: "AuthIndex",
                            validators_len: "u32",
                            block_num: "BlockNumber"
                        },
                        OperationRequestDexDeleteOrder: {
                            asset: "Asset",
                            order_id: "OrderId",
                            price: "FixedI64",
                            who: "AccountId",
                            buyout: "Option<Balance>",
                            authority_index: "AuthIndex",
                            validators_len: "u32",
                            block_num: "BlockNumber"
                        },
                        Order: {
                            order_id: "OrderId",
                            account_id: "AccountId",
                            side: "OrderSide",
                            price: "FixedI64",
                            amount: "FixedU128",
                            created_at: "u64",
                            expiration_time: "u64"
                        },
                        OrderType: {
                            _enum: {
                                Limit: "FixedI64",
                                Market: null
                            }
                        },
                        OrderId: "u64",
                        OrderSide: {
                            _enum: ["Buy", "Sell"]
                        },
                        PoolId: "u32",
                        PoolInfo: {
                            owner: "AccountId",
                            pool_asset: "AssetId",
                            assets: "Vec<AssetId>",
                            amplification: "Number",
                            fee: "Permill",
                            admin_fee: "Permill",
                            balances: "Vec<Balance>",
                            total_balances: "Vec<Balance>"
                        },
                        PoolTokenIndex: "u32",
                        PortfolioMetrics: {
                            period_start: "Duration",
                            period_end: "Duration",
                            z_score: "u32",
                            volatility: "FixedNumber",
                            value_at_risk: "FixedNumber"
                        },
                        Price: "u128",
                        PriceLog: {
                            latest_timestamp: "Duration",
                            prices: "CapVec<Price>"
                        },
                        PricePayload: {
                            public: "[u8; 33]",
                            asset: "Asset",
                            price: "FixedI64",
                            block_number: "BlockNumber"
                        },
                        PricePeriod: {
                            _enum: ["Min", "TenMin", "Hour", "FourHour", "Day"]
                        },
                        PricePoint: {
                            block_number: "BlockNumber",
                            timestamp: "u64",
                            last_fin_recalc_timestamp: "Timestamp",
                            price: "u64",
                            data_points: "Vec<DataPoint>"
                        },
                        PriceUpdate: {
                            period_start: "Duration",
                            time: "Duration",
                            price: "FixedNumber"
                        },
                        ProposalStatus: {
                            _enum: ["Initiated", "Approved", "Rejected"]
                        },
                        ProposalVotes: {
                            votes_for: "Vec<AccountId>",
                            votes_against: "Vec<AccountId>",
                            status: "ProposalStatus",
                            expiry: "BlockNumber"
                        },
                        ResourceId: "[u8; 32]",
                        Signature: "u32",
                        SignedBalance: {
                            _enum: {
                                Positive: "Balance",
                                Negative: "Balance"
                            }
                        },
                        SubAccType: {
                            _enum: ["Bailsman", "Borrower", "Lender"]
                        },
                        Timestamp: "u64",
                        TotalAggregates: {
                            collateral: "Balance",
                            debt: "Balance"
                        },
                        TransferReason: {
                            _enum: [
                                "Common",
                                "InterestFee",
                                "MarginCall",
                                "LiquidityFarming",
                                "BailsmenRedistribution",
                                "TreasuryEqBuyout",
                                "TreasuryBuyEq",
                                "Subaccount",
                                "Lock",
                                "Unlock",
                                "Claim",
                                "CurveFeeWithdraw"
                            ]
                        },
                        UserGroup: {
                            _enum: [
                                "UNKNOWN",
                                "Balances",
                                "Bailsmen",
                                "Borrowers",
                                "Lenders"
                            ]
                        },
                        UnsignedPriorityPair: "(u64, u64)",
                        VestingInfo: {
                            locked: "Balance",
                            perBlock: "Balance",
                            startingBlock: "BlockNumber"
                        }
                    }
                }
            ]
        }
    }
} as unknown as OverrideBundleType;
