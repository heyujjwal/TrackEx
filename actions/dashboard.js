"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"


const serializeTransaction = (obj) => {
    const serialized = {...obj}
    if(obj.balance) {
        serialized.balance = obj.balance.toNumber()
    }
    if(obj.amount) {
        serialized.amount = obj.amount.toNumber()
    }
    return serialized
}
export async function createAccount(data) {
    try {
        const {userId} = await auth()

        if(!userId) {
            throw new Error("User not authenticated")
        }

        const user= await db.user.findUnique({
            where: {
                clerkUserId: userId
            }

        })

        if(!user) {
            throw new Error("User not found")
        }
        const balanceFloat = parseFloat(data.balance)
        if(isNaN(balanceFloat)) {
            throw new Error("Invalid balance")
        }
        //check if this is user's first account
        const existingAccount = await db.account.findMany({
            where: {
                userId: user.id
            }
        })
        const shouldBeDefaultAccount = existingAccount.length === 0? true : data.isDefault

        if(shouldBeDefaultAccount) {
            //set all other accounts to non-default
            await db.account.updateMany({
                where: {
                    userId: user.id,
                    isDefault: true
                },
                data: {
                    isDefault: false
                }
            })
        }

        //create new account
        const newAccount= await db.account.create({
            data: {
               ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefaultAccount
            }
        })
        const serializedAccount = serializeTransaction(newAccount)
        revalidatePath("/dashboard")
        return {success: true, account: serializedAccount}
    } catch (error) {
        throw new Error("Error creating account: " + error.message)
    }
}

export async function getUserAccounts() {
    try {
        const {userId} = await auth()
        if(!userId) {
            throw new Error("User not authenticated")
        }
        const user= await db.user.findUnique({
            where: {
                clerkUserId: userId
            }   
        })

        if(!user) {
            throw new Error("User not found")
        }
        const accounts = await db.account.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                _count: {
                    select: {
                        transactions: true
                    }
                }
            }
        })
        const serializedAccounts = accounts.map(serializeTransaction)
        return serializedAccounts
    } catch (error) {
        throw new Error("Error fetching accounts: " + error.message)
    }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}
