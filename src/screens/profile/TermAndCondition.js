
/* eslint-disable semi */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import {
    Image, ImageBackground, Pressable, ScrollView, TextInput, View,
} from 'react-native'
import MyStatusBar from '../../elements/MyStatusBar'
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MyText from '../../elements/MyText'
const data = [1, 2, 3, 4, 5, 6, 7]
const TermAndCondition = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <MyStatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
            <View style={{ backgroundColor: "#fff", flex: 1, paddingHorizontal: 20 }}>
                <View style={{ backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 5 }}>
                    <Pressable onPress={() => navigation.goBack()} style={{ paddingVertical: 10 }}>
                        <AntDesign name={"close"} size={25} color="#000" />
                    </Pressable>
                    <MyText h4 bold style={{ color: "#292D32", }}>
                        Term And Condition
                    </MyText >
                    <Pressable style={{ paddingVertical: 10 }}>
                        <MaterialCommunityIcons name={"bell-badge-outline"} size={25} color="#fff" />
                    </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginVertical: 10, padding: 5 }}>
                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        1. Terms of Use
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050", }}>
                        Please Read The Terms And Conditions Carefully Before You Start To Use The Website. By Using The Website Or By Clicking To Accept Or Agree To The Terms Of Use When This Option Is Made Available To You, You Accept And Agree To Be Bound And Abide By These Terms Of Use And Our Privacy Policy, Found At, Incorporated Herein By Reference.
                        If You Do Not Want To Agree To These Terms Of Use Or The Privacy Policy, You Must Not Access Or Use The Website.
                    </MyText >

                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        2.	Legal Notices
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050" }}>
                        This Application Is Published And Operated By The Stemm Research Ltd Company (Referred To Hereinafter As «stemm Research»), A Limited Company Registered In England (Company Number 10443411) With Headquarters At The Following Address:
                        Unit 31, 73 London Road, Liverpool, Merseyside, L3 8hy, England.
                        You May Reach Us By Telephone At +44 745 3418908or Email At Liverpool@stemmresearch.com
                    </MyText >
                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        3. Copyright, Licenses And Idea Submissions.
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050" }}>
                        The Entire Contents Of The App (Firstsightdentaltm) And Site (Stemmresearch.com, Aidental.pro)are Protected By International Copyright And Trademark Laws. The Owner Of The Copyrights And Trademarks Are Stemm Research, Its Affiliates Or Other Third Party Licensors. You May Not Modify, Copy, Reproduce, Republish, Upload, Post, Transmit, Or Distribute, In Any Manner, The Material On The Site, Including Text, Graphics, Code And/or Software. You May Print And Download Portions Of Material From The Different Areas Of The Site Solely For Your Own Non-commercial Use Provided That You Agree Not To Change Or Delete Any Copyright Or Proprietary Notices From The Materials. You Agree To Grant To Stemm Research A Non-exclusive, Royalty-free, Worldwide, Perpetual License, With The Right To Sub-license, To Reproduce, Distribute, Transmit, Create Derivative Works Ofany Materials And Other Information (Including, Without Limitation, Ideas Contained Therein For New Or Improved Products And Services) You Submit To Any Public Areas Of This Site.
                    </MyText >
                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        4. Use Of The Service
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050" }}>
                        You Understand That, Except For Information, Products Or Services Clearly Identified As Being Supplied By Stemm Research, Stemmresearch.com,firstsightdentaltm,and Aidental.pro, Stemm Research Does Not Operate, Control Or Endorse Any Information, Products Or Services On The Internet In Any Way. You Also Understand That Stemm Research Cannot And Does Not Guarantee Or Warrant That Files Available For Downloading Through The Site Will Be Free Of Infection Or Viruses, Worms, Trojan Horses Or Other Code That Manifest Contaminating Or Destructive Properties. You Are Responsible For Implementing Sufficient Procedures And
                        Checkpoints To Satisfy Your Particular Requirements For Accuracy Of Data Input And Output, And For Maintaining A Means External To The Site For The Reconstruction Of Any Lost Data.
                        You Assume Total Responsibility And Risk For Your Use Of The App And The Internet. Stemm Research Provides The Site And Related Information “as Is” And Does Not Make Any Express Or Implied Warranties, Representations Or Endorsements Whatsoever (Including Without Limitation Warranties Of Title Or Noninfringement, Or The Implied Warranties Of Merchantability Or Fitness For A Particular Purpose) With Regard To The Service, Any Merchandise Information Or Service Provided Through The Service Or On The Internet Generally, And Stemm Research Shall Not Be Liable For Any Cost Or Damage Arising Either Directly Or Indirectly From Any Such Transaction. It Is Solely Your Responsibility To Evaluate The Accuracy, Completeness And Usefulness Of All Opinions, Advice, Services, Merchandise And Other Information Provided Through The Service Or On The Internet Generally. Stemm Research Does Not Warrant That The Service Will Be Uninterrupted Or Error-free Or That Defects In The Service Will Be Corrected.
                        You Understand Further That The Pure Nature Of The Internet Contains Unedited Materials Some Of Which Are Sexually Explicit Or May Be Offensive To You. Your Access To Such Materials Is At Your Risk. Stemm Research Has No Control Over And Accepts No Responsibility Whatsoever For Such Materials.
                    </MyText >
                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        5. Limitation Of Liability
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050" }}>
                        In No Event Will Stemm Research Be Liable For (I) Any Incidental, Consequential, Or Indirect Damages (Including, But Not Limited To, Damages For Loss Of Profits, Business Interruption, Loss Of Programs Or Information, And The Like) Arising Out Of The Use Of Or Inability To Use The Service, Or Any Information, Or Transactions Provided On The Service, Or Downloaded From The Service, Or Any Delay Of Such Information Or Service. Even If Stemm Research Or Its Authorized Representatives Have Been Advised Of The Possibility Of Such Damages, Or (Ii) Any Claim Attributable To Errors, Omissions, Or Other Inaccuracies In The Service And/or Materials Or Information Downloaded Through The Service. Because Some States Do Not Allow The Exclusion Or Limitation Of Liability For Consequential Or Incidental Damages, The Above Limitation May Not Apply To You. In Such States, Stemm Research Liability Is Limited To The Greatest Extent Permitted By Law.
                    </MyText >
                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        6. Indemnification
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050" }}>
                        You Agree To Indemnify, Defend And Hold Harmlessstemm Research, Its Officers, Directors, Employees, Agents, Licensors, Suppliers And Any Third Party Information Providers To The Service From And Against All Losses, Expenses, Damages And Costs, Including Reasonable Attorneys’ Fees, Resulting From Any Violation Of This Agreement (Including Negligent Or Wrongful Conduct) By You Or Any Other Person Accessing The Service.
                    </MyText >
                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        7. Third Party Rights
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050" }}>
                        The Provisions Of Paragraphs 4 (Use Of The Service), And 6 (Indemnification) Are For The Benefit Of Stemm Research And Its Officers, Directors, Employees, Agents, Licensors, Suppliers, And Any Third Party Information Providers To The Service. Each Of These Individuals Or Entities Shall Have The Right To Assert And Enforce Those Provisions Directly Against You On Its Own Behalf.
                    </MyText >
                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        8.Termination
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050" }}>
                        This Agreement May Be Terminated By Either Party Without Notice At Any Time For Any Reason. The Provisions Of Paragraphs 3 (Copyright, Licenses And Idea Submissions), 2 (Use Of The Service), 6 (Indemnification), 7 (Third Party Rights) And 9 (Miscellaneous) Shall Survive Any Termination Of This Agreement.
                    </MyText >
                    <MyText h4 bold style={{ color: "#292D32", marginVertical: 10 }}>
                        9.miscellaneous
                    </MyText >
                    <MyText h6 bold style={{ color: "#00000050" }}>
                        This Agreement Shall All Be Governed And Construed In Accordance With The Laws Of United Kingdom Applicable To Agreements Made And To Be Performed In United Kingdom. You Agree That Any Legal Action Or Proceeding Between Stemm Research And You For Any Purpose Concerning This Agreement Or The Parties’ Obligations Hereunder Shall Be Brought Exclusively In A Federal Or State Court Of Competent Jurisdiction Sitting In United Kingdom. Any Cause Of Action Or Claim You May Have With Respect To The Service Must Be Commenced Within One (1) Year After The Claim Or Cause Of Action Arises Or Such Claim Or Cause Of Action Is Barred.stemm Research’s Failure To Insist Upon Or Enforce Strict Performance Of Any Provision Of This Agreement Shall Not Be Construed As A Waiver Of Any Provision Or Right. Neither The Course Of Conduct Between The Parties Nor Trade Practice Shall Act To Modify Any Provision Of This Agreement. Stemm Research May Assign Its Rights And Duties Under This Agreement To Any Party At Any Time Without Notice To You.
                        Any Rights Not Expressly Granted Herein Are Reserved.
                    </MyText >
                </ScrollView>
            </View>

        </View>
    )
}

export default TermAndCondition