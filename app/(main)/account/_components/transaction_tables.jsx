"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, Pen, RefreshCcw, Search, Trash, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/accounts";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const RECURRING_INTERVAL = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
  };

const TransactionTable = ({ transaction }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "date", order: "asc" });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  const {loading: deleteLoading, data:deleted, fn: deleteFn} = useFetch(bulkDeleteTransactions);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transaction];

    if(search){
      result = result.filter((transaction) => transaction.description?.toLowerCase().includes(search.toLowerCase()));
    }

    if(typeFilter){
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    if(recurringFilter){
      result = result.filter((transaction) => {
        if(recurringFilter === 'recurring') 
          return transaction.isRecurring
        return !transaction.isRecurring
    })
  }

  //apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch(sortConfig.field){
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        default:
          comparison = 0;
          break;
      }
      return sortConfig.order === "asc" ? comparison : -comparison;
    })
    
    return result 
  }, [transaction, search, typeFilter, recurringFilter, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = filteredAndSortedTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, recurringFilter]);

  const handleSelect = (id) => {
    setSelectedTransactions((current) =>
      current.includes(id)
        ? current.filter((transactionId) => transactionId !== id)
        : [...current, id]
    );
  }

  const handleSelectAll = () => {
    setSelectedTransactions((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((transaction) => transaction.id)
    );
  }

  const handleSort = (field) => {
    setSortConfig(current=>({
      field,
      order: current.field === field && current.order === "asc" ? "desc" : "asc",
    }))
  };

  const handleBulkDelete = async() => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTransactions.length} transactions?`)) {
      return 
    }
    deleteFn(selectedTransactions);
  }

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
      setSelectedTransactions([]);
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedTransactions([]);
    setCurrentPage(1);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedTransactions([]); // Clear selections when changing pages
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1);
    setSelectedTransactions([]);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-4">
      {deleteLoading && (<BarLoader className='mt-4' width={"100%"} color='#3b82f6'/>)}
      
      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1" >
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8"/>
        </div>
        <div className=" flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger >
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={(value)=> setRecurringFilter(value)}>
            <SelectTrigger className="w-[140px]" >
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedTransactions.length > 0 && (
            <div className="flex gap-2 items-center">
              <Button variant={"destructive"} size={"sm"} onClick={handleBulkDelete}> 
                <Trash className="h-4 w-4 mr-2"/> 
                Delete Selected ({selectedTransactions.length})
              </Button>
            </div>
          )}

          {(search || typeFilter || recurringFilter) && (
            <Button size={"icon"} onClick={handleClearFilters} title="Clear Filters"> 
              <X className="h-4 w-4"/>
            </Button>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} results
        </div>
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption> List of transactions </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  onCheckedChange={handleSelectAll} 
                  checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0} 
                />
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">Date {
                    sortConfig.field === "date" && (
                      sortConfig.order === "asc" ? (<ChevronUp className="ml-1 h-4 w-4" />) : (<ChevronDown className="ml-1 h-4 w-4" />)
                    )
                  }</div>
              </TableHead>

              <TableHead className="">
                <div className="flex items-center">Description </div>
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center ">Category {
                    sortConfig.field === "category" && (
                      sortConfig.order === "asc" ? (<ChevronUp className="ml-1 h-4 w-4" />) : (<ChevronDown className="ml-1 h-4 w-4" />)
                    )
                  }</div>
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              > 
                <div className="flex items-center justify-end">Amount {
                    sortConfig.field === "amount" && (
                      sortConfig.order === "asc" ? (<ChevronUp className="ml-1 h-4 w-4" />) : (<ChevronDown className="ml-1 h-4 w-4" />)
                    )
                  }</div>
              </TableHead>

              <TableHead className="flex items-center "> Recurring </TableHead>

              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="">
                    <Checkbox onCheckedChange={() => handleSelect(transaction.id)} checked={selectedTransactions.includes(transaction.id)} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color:
                        transaction.transactionType === "INCOME"
                          ? "green"
                          : "red",
                    }}
                  >
                    {transaction.transactionType === "INCOME" ? "+" : "-"}₹
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                          >
                            <RefreshCcw className="h-4 w-4" />
                            {RECURRING_INTERVAL[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>
                              {format(
                                new Date(transaction.nextRecurringDate),
                                "PP"
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-4 w-4" /> One Time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="flex items-center text-sm"
                          onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
                        >
                          <Pen className="mr-2 h-3 w-3" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive text-sm" onClick={() => deleteFn([transaction.id])}>
                          <Trash className="text-destructive justify-center flex mr-2 h-3 w-3 " />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-1">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;