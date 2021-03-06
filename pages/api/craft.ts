// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      handleCraftRequest(req.body, res);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

// 1. get the recipe for title
// 2. get quantities of required ingredients & check if there's enough
// 3. if yes then craft the title
const handleCraftRequest = async (title, res) => {
  const category = title.includes("Elixir") ? "potion" : "dish";
  const referenceCategory = title.includes("Elixir")
    ? "referencePotion"
    : "referenceDish";

  let cache = [];
  let item;
  try {
    const result = await prisma[referenceCategory].findFirst({
      where: { title: title },
      include: { recipe: true },
    });
    if (!result) throw new Error("Provided entry doesn't exist");
    item = result;
  } catch (e) {
    res.status(500).json(e);
  }

  try {
    checkAvailability(item);
  } catch (e) {
    res.status(500).json({ msg: "Not enough materials" });
  }

  try {
    craft(item, category);
    res.status(200).json({ msg: item + "successfully created" });
  } catch (e) {
    res.status(500).json({ msg: "smth went wrongh" });
  }
};

async function checkAvailability(item) {
  let isAvailable: boolean;
  await Promise.all(
    item.recipe.map(async ({ title, quantity }) => {
      const data = await prisma.ingredient.findFirst({
        where: { title: title },
        select: {
          title: true,
          quantity: true,
        },
      });
      if (data.quantity < quantity) {
        isAvailable = false;
        return;
      }
      const ingr = await prisma.ingredient.update({
        where: { title: title },
        data: { quantity: data.quantity - quantity },
      });
    })
  );
  if (isAvailable === false) throw new Error("Not enough materials");
}

async function craft(craftingItem, category) {
  const result = await prisma[category].create({
    data: {
      title: craftingItem.title,
      effect: craftingItem.effect,
    },
  });
}
