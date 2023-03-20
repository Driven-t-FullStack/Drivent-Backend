import authenticationService, { SignInParams, SignInResult } from "@/services/authentication-service";
import userRepository from "@/repositories/user-repository";
import sessionRepository from "@/repositories/session-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


describe("authenticationService test suite", () => {
    const user: SignInParams = { email: 'teste@teste.com', password: '123456' }
    const token = 'HASH_MOCKADO';
    it("should respond with error message 'email or password are incorrect' 1", async () => {
        jest.spyOn(userRepository, "findByEmail").mockImplementationOnce((): any => {
            return undefined
        });
        const result = authenticationService.signIn(user);
        expect(result).rejects.toEqual({
            name: "InvalidCredentialsError",
            message: "email or password are incorrect",
        })
    });

    it("should respond with error message 'email or password are incorrect' 2", async () => {
        jest.spyOn(userRepository, "findByEmail").mockImplementation((): any => {
            return {
                id: 1,
                email: user.email,
                password: user.password,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        }
        );
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
            return false
        })
        const result = authenticationService.signIn(user);
        expect(result).rejects.toEqual({
            name: "InvalidCredentialsError",
            message: "email or password are incorrect",
        })
    })
    it("should respond with user", async () => {
        jest.spyOn(sessionRepository, 'create').mockResolvedValue({
            id: 1,
            token,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        jest.spyOn(userRepository, "findByEmail").mockImplementation((): any => {
            return {
                id: 1,
                email: user.email,
                password: user.password,
            }
        }
        );
        jest.spyOn(bcrypt, 'compare').mockImplementation((): any => {
            return true
        });
        jest.spyOn(jwt, 'sign').mockImplementation((): any => {
            return token
        });
        const result = await authenticationService.signIn(user);
        expect(result).toEqual({ user: { email: user.email, id: 1 }, token })
    })
})