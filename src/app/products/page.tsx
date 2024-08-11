import React from "react";
import productApiRequest from "../../apiRequest/api.product";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import DeleteProduct from "./_components/delete-product";
import { cookies } from "next/headers";

export default async function ProductListPage() {
	const cookieStore = cookies();
	const sessionToken = cookieStore.get("sessionToken")?.value || "";
	const isAuthenticated = sessionToken ? true : false;

	const res = await productApiRequest.getList();
	const productList = res.payload.data;

	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Product List Page</h4>
			{isAuthenticated && <Link href={"/products/add"}>Add Product</Link>}
			<div className="flex justify-center">
				<ul>
					{productList.map((product) => (
						<li className="flex gap-2 items-center" key={product.id}>
							<Link href={"/products/" + product.id}>
								<Image
									src={product.image}
									alt={product.name}
									width={100}
									height={100}
									className="w-32 h-32 object-cover"
								/>
							</Link>
							<p>{product.name}</p>
							<p>{product.price}</p>
							{isAuthenticated && (
								<div className="flex space-x-2">
									<Button variant={"outline"}>
										<Link href={"/products/" + product.id + "/edit"}>Edit</Link>
									</Button>
									<DeleteProduct product={product} />
								</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
