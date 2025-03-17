
"use server"

import { cache } from "@/lib/cache";
import { prisma } from "@/lib/db"


export const getDocs = cache (async () => {
    try {
        const [docs, customers] = await Promise.all([
            prisma.document.findMany(),
            prisma.customer.findMany()
        ]);

        return { docs, customers };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { docs: [], customers: [] };
    }
},
["getDocs"],

{ revalidate: 30 *30 , tags:['getDocs']}

)