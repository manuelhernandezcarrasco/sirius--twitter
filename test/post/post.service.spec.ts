import { PostService, PostServiceImpl } from '../../src/domains/post/service';
import { PostRepository, PostRepositoryImpl } from '../../src/domains/post/repository';
import { PrismaTestService, sync, teardown } from '../database.test.config';
import { PostDTO } from 'src/domains/post/dto';

describe('User Service Unit Testing', () => {
    let postService: PostService;
    let postRepository: PostRepository;
    let db: any;

    beforeEach(async() => {
        db = new PrismaTestService();
        sync();
        postRepository = new PostRepositoryImpl(db);
        postService = new PostServiceImpl(postRepository);
    });

    afterEach(async() => {
        teardown(db);
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