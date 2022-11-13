import {mutate} from "@onflow/fcl"
import {reauthenticate} from "@onflow/fcl"
import * as fcl from "@onflow/fcl"
import useCurrentUser from "../hooks/use-current-user";
import { useState } from "react";

const sendFlow = async (recepient, amount) => {
    const cadence = `
      import FungibleToken from 0xFUNGIBLETOKENADDRESS
      import FlowToken from 0xFLOWTOKENADDRESS
  
      transaction(recepient: Address, amount: UFix64){
        prepare(signer: AuthAccount){
          let sender = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow Provider reference to the Vault")
  
          let receiverAccount = getAccount(recepient)
  
          let receiver = receiverAccount.getCapability(/public/flowTokenReceiver)
            .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
            ?? panic("Could not borrow Receiver reference to the Vault")
  
                  let tempVault <- sender.withdraw(amount: amount)
          receiver.deposit(from: <- tempVault)
        }
      }
    `;
    const args = (arg, t) => [arg(recepient, t.Address), arg(amount, t.UFix64)];
    const limit = 200;
  
    const txId = await mutate({ cadence, args, limit });
  
      console.log("Waiting for transaction to be sealed...");
  
      const txDetails = await fcl.tx(txId).onceSealed();
    console.log({ txDetails });
  };

export const LABEL = "Transfer";

export const CMD = async () =>{
  //await reauthenticate();
  await fcl.currentUser().subscribe(async (account)=>{
    console.log("account:", account);
  const data = {
    sc_address: account, 
    domain: window.location.href
  }
  const res = await fetch("/",{
    method:"POST",
    headers:{
        'Content-Type': 'application/json;charset=utf-8'
    },
    body:JSON.stringify(data)
   } )
  console.log(res.body.score);
  //sendFlow("0x179b6b1cb6755e31", 100);

  });
}