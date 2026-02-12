import { makeAutoObservable, runInAction } from "mobx";
import RoomDomain from "../../domain/room/RoomDomain";
import { Room } from "../../types/room/RoomType";
import { mockRoom } from "../../../mock/room";

class RoomStore {
  rooms: Room[] = [...mockRoom];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchRooms() {
    this.isLoading = false;
  }

  async save(domain: RoomDomain) {
    try {
      runInAction(() => {
        const payload = domain.getBackendObject() as Room;

        if (domain.id) {
          // Edição
          const index = this.rooms.findIndex((r) => r.id === domain.id);
          if (index !== -1) {
            this.rooms[index] = { ...payload, id: domain.id };
          }
        } else {
          const newRoom: Room = {
            ...payload,
            id: Math.floor(Math.random() * 10000),
          };
          this.rooms.push(newRoom);
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(id: number) {
    runInAction(() => {
      this.rooms = this.rooms.filter((r) => r.id !== id);
    });
    return true;
  }
}

export const roomStore = new RoomStore();
