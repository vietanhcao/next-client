import React from "react";
import productApiRequest from "../../apiRequest/api.product";
import Image from "next/image";
import { Button } from "../../components/ui/button";

export default async function ProductListPage() {
	const res = await productApiRequest.getList();
	const productList = res.payload.data;

	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Product List Page</h4>
			<div className="flex justify-center">
				<ul>
					{productList.map((product) => (
						<li className="flex gap-2 items-center" key={product.id}>
							<Image
								src={product.image}
								alt={product.name}
								width={100}
								height={100}
								className="w-32 h-32 object-cover"
							/>
							<p>{product.name}</p>
							<p>{product.price}</p>
							<div className="flex space-x-2">
								<Button variant={"outline"}> Edit</Button>
								<Button variant={"destructive"}> Delete</Button>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
