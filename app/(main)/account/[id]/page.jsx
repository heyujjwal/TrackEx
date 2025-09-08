import { getAccountDetailsById } from '@/actions/accounts'
import NotFound from '@/app/not-found'
import React, { Suspense } from 'react'
import TransactionTable from '../_components/transaction_tables'
import { BarLoader } from 'react-spinners'
import AccountChart from '../_components/AccountChart'

const AccountPage = async({params}) => {
  const accountData = await getAccountDetailsById(params.id)

  if(!accountData){
    return NotFound()
  }

  const {transactions, ...account} = accountData

  return (
    <div className='space-y-8 px-5 '>
        <div className='flex gap-4 items-end justify-between'>

        <div>
            <h1 className='text-5xl sm:text-6xl gradient-title capitalize font-bold'>{account.name}</h1>
            <p className='text-muted-foreground'>{account.type.charAt(0)+ account.type.slice(1).toLowerCase()} Account</p>
        
        </div>
        <div className= "text-right pb-2">
            <div className='text-xl sm:text-2xl font-bold'>₹{parseFloat(account.balance).toFixed(2)}</div>
            <p className='text-muted-foreground text-sm'>{account._count.transactions} Transactions</p>
        </div>

        </div>
        {/* {chart section} */}
        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#3b82f6'/>}>
            <AccountChart transactions={transactions}/>
        </Suspense>

        {/* Transaction table */}
        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#3b82f6'/>}>
            <TransactionTable transaction={transactions}/>
        </Suspense>
    </div>
  )
}

export default AccountPage
