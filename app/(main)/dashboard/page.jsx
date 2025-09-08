import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/create-account-drawer";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Plus } from "lucide-react";
import React from "react";
import AccountCard from "./_components/account_card";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budgetProgress";
import {DashboardOverview} from "./_components/dashboard-overview";
const DashboardPage = async () => {

  const [accounts,transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData()
  ])

  const defaultAccount = accounts?.find((account)=> account.isDefault)

  let budgetData=null

  if(defaultAccount)
    budgetData= await getCurrentBudget(defaultAccount.id)


  return (
    <div className="px-5">
      {/* Budget Progress */}
      {defaultAccount && <BudgetProgress 
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />}


      {/* Overview */}
         <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />
      {/* Account Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 ">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md  transition-shadow cursor-pointer flex items-center justify-center border-dashed border-4 h-50">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="font-medium">Create New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {/* // account cards */}
        {accounts.length > 0 && accounts?.map((account) => {
          return <AccountCard key={account.id} account={account}/>
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
