import enrollmentsService from "@/services/enrollments-service";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { Address, Enrollment } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";


describe("enrollment service test suite", () => {
    it("getAddressFromCEP => should respond with not found error", async () => {
        const invalidCep = '000000-000';
        const result = enrollmentsService.getAddressFromCEP(invalidCep);
        expect(result).rejects.toEqual(
            {
                name: "NotFoundError",
                message: "No result for this search!",
            }
        )
    });
    it("getAddressFromCEP => should respond with address", async () => {
        const randomCep = '57083-102';
        const result = await enrollmentsService.getAddressFromCEP(randomCep);
        expect(result).toEqual(
            {
                "bairro": "Antares",
                "cidade": "Maceió",
                "complemento": "(Lot Brisa do Tabuleiro)",
                "logradouro": "Rua B",
                "uf": "AL",
            }
        )
    });
    const enrollment: Enrollment & { Address: Address[] } = {
        id: 105,
        name: 'Ignacio Dickinson',
        cpf: '41659425026',
        birthday: new Date(),
        phone: '(94) 96362-4325',
        userId: 692,
        createdAt: new Date('2023 - 03 - 19T18: 19: 59.048Z'),
        updatedAt: new Date('2023 - 03 - 19T18: 19: 59.049Z'),
        Address: [
            {
                id: 104,
                cep: '12795',
                street: 'Orn Hills',
                city: 'Purdyville',
                state: 'Mato Grosso do Sul',
                number: '64003',
                neighborhood: 'Graciemouth',
                addressDetail: null,
                enrollmentId: 105,
                createdAt: new Date('2023 - 03 - 19T18: 19: 59.049Z'),
                updatedAt: new Date('2023 - 03 - 19T18: 19: 59.049Z')
            }
        ]
    }
    it("getOneWithAddressByUserId => should respond with not found error", async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(() => {
            return undefined
        })
        const result = enrollmentsService.getOneWithAddressByUserId(1);
        expect(result).rejects.toEqual({
            name: "NotFoundError",
            message: "No result for this search!",
        });

    })
    it("getOneWithAddressByUserId => should respond with enrollment", async () => {
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementation((): any => {
            return enrollment
        });
        const { id, name, cpf, birthday, phone } = enrollment
        const address = exclude(enrollment.Address[0], "updatedAt", "createdAt", "enrollmentId")
        const result = await enrollmentsService.getOneWithAddressByUserId(692);
        expect(result).toEqual({
            id, name, cpf, birthday:birthday.toISOString(), phone, address
        })
    })
})