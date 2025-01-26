import UseCaseInterface from "src/modules/@shared/usecase/use-case.interface";
import { AddProductInputDto, AddProductOutputDto } from "./add-product.dto";

export interface AddProductUseCaseInterface extends UseCaseInterface {
  execute(input: AddProductInputDto): Promise<AddProductOutputDto>;
}
