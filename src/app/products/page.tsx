import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import productApiRequest from "../../apiRequest/api.product";
import dynamic from "next/dynamic";
const ProductAddButton = dynamic(
	() => import("./_components/product-add-button"),
	{ ssr: false }
);
const ProductEditButton = dynamic(
	() => import("./_components/product-edit-button"),
	{ ssr: false }
);

export const metadata: Metadata = {
	title: "List Product",
};

export default async function ProductListPage() {
	const res = await productApiRequest.getList();
	const productList = res.payload.data;

	return (
		<div>
			<h4 className="text-2xl font-semibold text-center">Product List Page</h4>
			<ProductAddButton />
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
							<ProductEditButton product={product} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
