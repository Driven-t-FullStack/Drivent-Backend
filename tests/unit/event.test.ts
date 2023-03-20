import eventRepository from "@/repositories/event-repository"
import eventsService, { GetFirstEventResult } from "@/services/events-service"

describe("event test suite", () => {
    it("should respond with not found error", async () => {
        jest.spyOn(eventRepository, 'findFirst').mockImplementationOnce((): any => {
            return undefined
        })
        const result = eventsService.getFirstEvent();
        expect(result).rejects.toEqual({
            name: "NotFoundError",
            message: "No result for this search!",

        })
    });
    it("should respond with event", async () => {
        jest.spyOn(eventRepository, 'findFirst').mockImplementation((): any => {
            return {
                "id": 1,
                "title": "Driven.t",
                "backgroundImageUrl": "linear-gradient(to right, #FA4098, #FFD77F)",
                "logoImageUrl": "https://files.driveneducation.com.br/images/logo-rounded.png",
                "startsAt": "2023-03-13T16:02:27.833Z",
                "endsAt": "2023-04-03T16:02:27.833Z"
            }
        })
        const result: GetFirstEventResult = await eventsService.getFirstEvent();
        expect(result).toEqual({
            "id": 1,
            "title": "Driven.t",
            "backgroundImageUrl": "linear-gradient(to right, #FA4098, #FFD77F)",
            "logoImageUrl": "https://files.driveneducation.com.br/images/logo-rounded.png",
            "startsAt": "2023-03-13T16:02:27.833Z",
            "endsAt": "2023-04-03T16:02:27.833Z"
        })
    })
})