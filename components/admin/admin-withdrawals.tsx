"use client"

import { useEffect, useState } from "react"
import { useAdminStore } from "@/lib/stores/admin-store"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function AdminPaymentOrdersPage() {
  const {
    orders,
    page,
    totalPages,
    isLoading,
    error,
    getPaymentOrders,
    approveOrRejectPaymentOrder,
  } = useAdminStore()

  const [type, setType] = useState<"DEPOSIT" | "WITHDRAWAL">("WITHDRAWAL")
  const [status, setStatus] = useState<"PENDING" | "AWAITING_APPROVAL">("PENDING")

  useEffect(() => {
    getPaymentOrders(type, status, 0, 10)
  }, [type, status])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) getPaymentOrders(type, status, newPage, 10)
  }

  const handleApprove = async (id: number) => {
    await approveOrRejectPaymentOrder(id, true)
    toast.success("Order approved")
  }

  const handleReject = async (id: number) => {
    const reason = prompt("Enter reason for rejection (optional):") || ""
    await approveOrRejectPaymentOrder(id, false, reason)
    toast.info("Order rejected")
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Payment Orders</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="DEPOSIT">Deposits</option>
            <option value="WITHDRAWAL">Withdrawals</option>
          </select>

          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="PENDING">Pending</option>
            <option value="AWAITING_APPROVAL">Awaiting Approval</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Txn Ref</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No {type.toLowerCase()}s with status {status.toLowerCase()} found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-700 dark:text-gray-300">{order.txnRef}</TableCell>
                    <TableCell>{order.txnType}</TableCell>
                    <TableCell>{order.amount} {order.currency}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt ?? "").toLocaleString()}</TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(order?.id ?? 0)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white transition"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReject(order.id ?? 0)}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white transition"
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No {type.toLowerCase()}s with status {status.toLowerCase()} found
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold">Order #{order.id}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <div><strong>User:</strong> {order.userId}</div>
                  <div><strong>Txn Ref:</strong> {order.txnRef}</div>
                  <div><strong>Type:</strong> {order.txnType}</div>
                  <div><strong>Amount:</strong> {order.amount} {order.currency}</div>
                  <div><strong>Date:</strong> {new Date(order.createdAt ?? "").toLocaleString()}</div>
                </div>
                <div className="flex gap-2 justify-end mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(order?.id ?? 0)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReject(order.id ?? 0)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0 || isLoading}
          variant="outline"
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        <span className="text-sm text-gray-600">
          Page {page + 1} of {totalPages}
        </span>

        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages - 1 || isLoading}
          variant="outline"
          className="flex items-center gap-1"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
