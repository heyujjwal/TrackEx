"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";


const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);

  //form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "SAVINGS",
      balance: "",
      isDefault: false,
    },
  });

  //create account
  const {
    data: newAccount,
    loading: createAccountLoading,
    error,
    fn: createAccountFunction,
  } = useFetch(createAccount);

  //close drawer and reset form on success
  useEffect(() => {
    if(newAccount && createAccountLoading === false) {
        toast.success("Account created successfully")
        reset()
        setOpen(false)
    }

  }, [createAccountLoading, newAccount])

    // show error toast on error
    useEffect(() => {
    if (error) {
        toast.error(error.message || "Failed while creating account");
    }
    }, [error]);

  //handle form submit
  const onSubmit = async (data) => {
    await createAccountFunction(data);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          {/* Form goes here */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium ">
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g. Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            {/* type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type">
                  <SelectValue
                    placeholder="Select account type"
                    {...register("type")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                  <SelectItem value="CURRENT">Current</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500">{errors.type.message}</p>
              )}
            </div>
            {/* balance */}
            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium ">
                Initial Balance
              </label>
              <Input
                id="balance"
                type={"number"}
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-red-500">{errors.balance.message}</p>
              )}
            </div>
            {/* isDefault */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <label
                  htmlFor="isDefault"
                  className="text-sm font-medium cursor-pointer"
                >
                  Set as Default Account
                </label>

                <p className="text-sm text-muted-foreground">
                  Set this account as your default account for all transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            {/* actions */}
            <div className="flex items-center space-x-2 pt-4">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  className="flex-1"
                  onClick={() => {
                    reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className={"flex-1"}
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
