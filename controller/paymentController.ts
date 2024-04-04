import { Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '..';
import Razorpay from 'razorpay';
import { PrismaClient, Booking } from "@prisma/client";

const prisma = new PrismaClient();
// import { Payment } from '../models/paymentModel.js';


export const instance = new Razorpay({
    key_id: "rzp_test_XuVfyqvtWcYTbz",
    key_secret: "mGRwF9yAGTFBZNglxbBfBEsJ",
  });

export const checkout = async (req: Request, res: Response): Promise<void> => {
  const options: { amount: number; currency: string } = {
    amount: Number(req.body.amount * 100),
    currency: 'INR',
  };
  const order = await instance.orders.create(options);
logger.info(order)
  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
    const bookingId= parseInt(req.params.bookingId)
    console.log(razorpay_order_id);
    console.log(razorpay_payment_id);
    console.log(razorpay_signature);
    
    
  const body: string = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature: string = crypto
    .createHmac('sha256', "mGRwF9yAGTFBZNglxbBfBEsJ")
    .update(body.toString())
    .digest('hex');

  const isAuthentic: boolean = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    // await Payment.create({
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   razorpay_signature,
    // });

   logger.info( razorpay_order_id)
     logger.info(razorpay_payment_id)
     logger.info(razorpay_signature)
   
    //  res.status(200).json({
    //     success: true,
    //    data:{
    //     razorpay_payment_id
    //    }
    //   });

    await prisma.booking.update({
        where: { id: bookingId },
        data: {
            bookingStatus: "comfirm",
            paymentStatus:"confirm",
            bookingReference: razorpay_payment_id
        },
      });    res.redirect(
      `http://localhost:5173/user`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};