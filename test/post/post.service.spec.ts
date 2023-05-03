import { PostService, PostServiceImpl } from '../../src/domains/post/service';
import { PostRepository, PostRepositoryImpl } from '../../src/domains/post/repository';
import { PostDTO } from 'src/domains/post/dto';
import { db } from '../../src/utils'

describe('User Service Unit Testing', () => {
    let postService: PostService;
    let postRepository: PostRepository;

    beforeEach(async() => {
        postRepository = new PostRepositoryImpl(db);
        postService = new PostServiceImpl(postRepository);
    });

    afterEach(async() => {
        await db.$executeRawUnsafe(`DROP SCHEMA IF EXISTS CASCADE;`);
        await db.$disconnect();
    });

    describe("getPost", () => {
        it("should return post", async() => {
            const post: PostDTO = {
                id: '123',
                authorId: '123123',
                content: 'post content',
                images: ['image1', 'image2'],
                createdAt: new Date()
            }
            jest.spyOn(postRepository, "getById").mockImplementation(() => Promise.resolve(post));
            const response = await postService.getPost('123123', '123');
            expect(response).toEqual(post);
        });
        
        it("sould throw - NotFoundException", async() => {
            try {
                jest.spyOn(postRepository, "getById").mockImplementation(() => Promise.resolve(null));
                await postService.getPost('123123', '123');
            } catch(error) {
                expect(error).toBeTruthy();
            }
        });
    });

});