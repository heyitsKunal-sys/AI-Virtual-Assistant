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
      toast.error("Setup your assistant first");
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
            new Date(user.proExpiresAt) - new Date()
          ) / (1000 * 60 * 60 * 24)
        )
      )
      : 0;

  const handlePay = async () => {
    try {
      const res = await axios.post(
        ServerUrl + "/api/billing/order",
        { plan: "pro" },
        { withCredentials: true }
      )

      const order = res.data.order

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ChatPlug",
        description: "Pro Plan",
        order_id: order.id,

        handler: async (response) => {
          const verifyRes = await axios.post(
            ServerUrl + "/api/billing/verify",
            response,
            { withCredentials: true }
          )

          if (verifyRes.data.success) {
            toast.success("Payment successfully")
            setUser(verifyRes.data.user)
          }
        },

        theme: {
          color: "#D97757",
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
    {
      label: "Current Plan",
      value: user?.plan,
      capitalize: true
    },
    {
      label: "Gemini Status",
      value: user?.geminiStatus,
      capitalize: true,
      tone:
        user?.geminiStatus === "active"
          ? "text-[#5B8C65]"
          : user?.geminiStatus === "invalid"
            ? "text-[#C85D3F]"
            : "text-[#B77A32]",
    },
    {
      label: user?.plan === "free" ? "Messages Left" : "Plan Expiry",
      value:
        user?.plan === "free"
          ? remainingMessages
          : `${remainingDays} Days`,
    },
  ]

  return (
    <div className='min-h-screen bg-[#F7F4EE] px-4 py-10'>

      <div className='max-w-5xl mx-auto'>

        {/* HEADER */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-[#292722]'>
            Plans & Billing
          </h2>

          <p className='text-[#746F67] mt-1'>
            Track your usage and upgrade whenever you're ready.
          </p>
        </div>


        {/* STATS */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>

          {statCards.map((s, i) => (
            <Card
              key={i}
              className='
                bg-[#FFFCF7]
                border-[#DDD7CE]
                shadow-[0_8px_25px_rgba(72,58,45,0.05)]
              '
            >
              <CardContent className="p-6">

                <p className='text-sm text-[#918A80]'>
                  {s.label}
                </p>

                <h2
                  className={`text-xl font-bold mt-1 capitalize ${
                    s.tone || "text-[#292722]"
                  }`}
                >
                  {s.value}
                </h2>

              </CardContent>
            </Card>
          ))}

        </div>


        {/* PLANS */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-10'>

          <div className="md:col-span-2 -mb-2">

            <h3 className="text-lg font-semibold text-[#292722]">
              Choose what fits you
            </h3>

            <p className="text-sm text-[#746F67] mt-1">
              Switch plans anytime — no lock-in, no hidden fees.
            </p>

          </div>


          {/* FREE */}
          <Card className="
            p-8
            bg-[#FFFCF7]
            border-[#DDD7CE]
            shadow-[0_10px_35px_rgba(72,58,45,0.05)]
          ">

            <h2 className="text-2xl font-bold text-[#292722]">
              Free Plan
            </h2>

            <h3 className="text-5xl font-bold mt-5 text-[#292722]">
              ₹0
            </h3>

            <ul className="mt-6 space-y-4 text-[#655F56]">

              {[
                "200 AI messages",
                "Voice assistant",
                "Navigation support",
                "Basic customization"
              ].map((item) => (

                <li
                  key={item}
                  className="flex items-center gap-2.5"
                >
                  <HiCheckCircle className="text-[#D97757] flex-shrink-0" />
                  {item}
                </li>

              ))}

            </ul>

          </Card>


          {/* PRO */}
          <div className='
            relative
            rounded-3xl
            p-8
            bg-[#292722]
            text-white
            shadow-[0_15px_45px_rgba(72,58,45,0.15)]
            overflow-hidden
          '>

            <div className="
              absolute
              -top-10
              -right-10
              w-40
              h-40
              bg-[#D97757]/20
              rounded-full
              blur-2xl
            " />

            <div className="flex items-center justify-between relative">

              <h2 className="text-2xl font-bold text-white">
                Pro Plan
              </h2>

              <Badge
                variant="solid"
                className="
                  bg-[#D97757]
                  text-white
                  border-0
                "
              >
                Most Popular
              </Badge>

            </div>

            <h3 className="text-5xl font-bold mt-5 text-white relative">
              ₹699
            </h3>

            <p className='mt-2 text-[#C8C2B9] relative'>
              3 Months Access
            </p>

            <ul className='mt-6 space-y-4 text-[#E4DED6] relative'>

              {[
                "Unlimited AI messages",
                "Advanced AI assistant",
                "Priority performance",
                "Unlimited navigation",
                "Premium support"
              ].map((item) => (

                <li
                  key={item}
                  className="flex items-center gap-2.5"
                >
                  <HiCheckCircle className="text-[#D97757] flex-shrink-0" />
                  {item}
                </li>

              ))}

            </ul>

            <Button
              onClick={handlePay}
              disabled={user?.plan === "pro"}
              variant="white"
              className={`
                mt-8
                w-full
                h-14
                relative
                bg-[#D97757]
                hover:bg-[#C96442]
                text-white
                border-0
                ${user?.plan === "pro"
                  ? "opacity-90 cursor-default"
                  : ""
                }
              `}
            >
              {user?.plan === "pro"
                ? "Active Plan"
                : "Upgrade Now"
              }
            </Button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Billing