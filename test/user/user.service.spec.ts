import { UserService, UserServiceImpl } from '../../src/domains/user/service';
import { UserRepository, UserRepositoryImpl } from '../../src/domains/user/repository';
import { PrismaTestService, sync, teardown } from '../database.test.config';
import { UserDTO } from '../../src/domains/user/dto';

describe('User Service Unit Testing', () => {
    let userService: UserService;
    let userRepository: UserRepository;
    let db: any;

    beforeEach(async() => {
        db = new PrismaTestService();
        sync();
        userRepository = new UserRepositoryImpl(db);
        userService = new UserServiceImpl(userRepository);
    });

    afterEach(async() => {
        teardown(db);
    });

    describe("getUser", () => {
        it("should return user", async() => {
            const user: UserDTO = {
                id: '123',
                name: 'manu',
                private: false,
                createdAt: new Date()
            }
            jest.spyOn(userRepository, "getById").mockImplementation(() => Promise.resolve(user));
            const response = await userService.getUser('123');
            expect(response).toEqual(user);
        });
        
        it("sould throw - NotFoundException", async() => {
            try {
                jest.spyOn(userRepository, "getById").mockImplementation(() => Promise.resolve(null));
                await userService.getUser('123');
            } catch(error) {
                expect(error).toBeTruthy();
            }
        });
    });

});