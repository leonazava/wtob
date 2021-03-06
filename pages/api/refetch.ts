import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      refetch(req, res);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }
}

const refetch = async (req: NextApiRequest, res: NextApiResponse) => {
  const potions = await prisma.potion.findMany({ orderBy: { id: "asc" } });
  const dishes = await prisma.dish.findMany({ orderBy: { id: "asc" } });
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { id: "desc" },
  });
  const data = {
    ingredients: ingredients,
    consumables: [...potions, ...dishes],
  };
  res.status(200).json(data);
};
