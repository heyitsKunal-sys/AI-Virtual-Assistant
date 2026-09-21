import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ServerUrl } from '../App';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { HiCheckCircle } from 'react-icons/hi2';

function Billing({ user, setUser }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !user.isSetupComplete) {
      toast.error(
        "Setup your assistant first"
      );
      navigate("/builder");
    }
  }, [])

  const remainingMessages =
    Math.max(
      0,
      (user?.requestLimit || 0) -
      (user?.totalMessages || 0)
    );

  const remainingDays =
    user?.proExpiresAt
      ? Math.max(
        0,
        Math.ceil(
          (
            new Date(
              user.proExpiresAt
            ) - new Date()
          ) /
          (1000 * 60 * 60 * 24)
        )
      )
      : 0;

  const handlePay = async () => {
    try {
      const res = await axios.post(ServerUrl + "/api/billing/order", { plan: "pro" }, { withCredentials: true })

      const order = res.data.order

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ChatPlug",
        description: "Pro Plan",
        order_id: order.id,

        handler: async (response) => {
          const verifyRes = await axios.post(ServerUrl + "/api/billing/verify", response, { withCredentials: true })

          if (verifyRes.data.success) {
            toast.success("Payment successfully")
            setUser(verifyRes.data.user)
          }
        },
        theme: {
          color: "#4f46e5",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast.error("Payment Failed")
      console.log(error);
    }
  }

  const statCards = [
    { label: "Current Plan", value: user?.plan, capitalize: true },
    {
      label: "Gemini Status",
      value: user?.geminiStatus,
      capitalize: true,
      tone:
        user?.geminiStatus === "active"
          ? "text-emerald-600"
          : user?.geminiStatus === "invalid"
            ? "text-red-500"
            : "text-amber-500",
    },
    {
      label: user?.plan === "free" ? "Messages Left" : "Plan Expiry",
      value: user?.plan === "free" ? remainingMessages : `${remainingDays} Days`,
    },
  ]

  return (
    <div className='min-h-screen brand-surface px-4 py-10'>

      <div className='max-w-5xl mx-auto'>

        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-slate-900'>
            Plans & Billing
          </h2>
          <p className='text-slate-500 mt-1'>Track your usage and upgrade whenever you're ready.</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>
          {statCards.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <p className='text-sm text-slate-400'>{s.label}</p>
                <h2 className={`text-xl font-bold mt-1 capitalize ${s.tone || "text-slate-900"}`}>{s.value}</h2>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-10'>

          <div className="md:col-span-2 -mb-2">
            <h3 className="text-lg font-semibold text-slate-900">Choose what fits you</h3>
            <p className="text-sm text-slate-500 mt-1">Switch plans anytime — no lock-in, no hidden fees.</p>
          </div>

          {/* free */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Free Plan
            </h2>

            <h3 className="text-5xl font-bold mt-5 text-slate-900">
              ₹0
            </h3>

            <ul className="mt-6 space-y-4 text-slate-600">
              {["200 AI messages", "Voice assistant", "Navigation support", "Basic customization"].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <HiCheckCircle className="text-indigo-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Pro */}
          <div className='relative rounded-3xl p-8 brand-gradient text-white shadow-lg shadow-indigo-500/25 overflow-hidden'>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

            <div className="flex items-center justify-between relative">
              <h2 className="text-2xl font-bold text-white">
                Pro Plan
              </h2>
              <Badge variant="solid" className="bg-white/15 border border-white/20">Most Popular</Badge>
            </div>

            <h3 className="text-5xl font-bold mt-5 text-white relative">
              ₹699
            </h3>

            <p className='mt-2 opacity-80 relative'>3 Months Access</p>

            <ul className='mt-6 space-y-4 opacity-90 relative'>
              {["Unlimited AI messages", "Advanced AI assistant", "Priority performance", "Unlimited navigation", "Premium support"].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <HiCheckCircle className="text-white flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              onClick={handlePay}
              disabled={user?.plan === "pro"}
              variant="white"
              className={`mt-8 w-full h-14 relative ${user?.plan === "pro" ? "opacity-90 cursor-default" : ""}`}
            >
              {user?.plan === "pro" ? "Active Plan" : "Upgrade Now"}
            </Button>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Billing
