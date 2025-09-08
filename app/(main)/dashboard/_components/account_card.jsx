"use client";
import { updateDefaultAccount } from "@/actions/accounts";
import useFetch from "@/hooks/use-fetch";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

const AccountCard = ({ account }) => {
  const { id, name, type, balance, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultAccountFn,
    data: updateDefaultAccountData,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    if (isDefault) {
      toast.warning("You need atleast one default account");
      return;
    }
    await updateDefaultAccountFn(id);
  };

  useEffect(() => {
    if (updateDefaultAccountData?.success) {
      toast.success("Default account updated");
    }
  }, [updateDefaultAccountData, updateDefaultLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Card
      key={account.id}
      className="hover:shadow-md  transition-shadow cursor-pointer h-50"
    >
      <Link href={`/account/${id}`}>
        <CardHeader className="flex justify-between items-center flex-row space-y-0 pb-2">
          <CardTitle className="text-md capitalize font-medium">
            {name}
          </CardTitle>
          <Switch checked={isDefault} onClick={handleDefaultChange} disabled={updateDefaultLoading}/>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-full">
          <div className="text-2xl font-bold">
            ₹{parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1 text-green-600" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="h-4 w-4 mr-1 text-red-600" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
