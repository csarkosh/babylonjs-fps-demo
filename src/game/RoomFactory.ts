import {
    Color3,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    PhysicsImpostor,
    PointLight,
    Scene,
    TransformNode,
    Vector3
} from "@babylonjs/core";
import PBRMaterialFactory, {PBREnum} from "./PBRMaterialFactory";

export default class RoomFactory {
    private matFactory: PBRMaterialFactory = null
    private readonly scene: Scene = null

    public constructor(scene: Scene, pbrMaterialFactory: PBRMaterialFactory) {
        this.scene = scene
        this.matFactory = pbrMaterialFactory
    }

    public create = (): void => {
        const WALL_HEIGHT = 35
        const WALL_WIDTH = 100
        const root = new TransformNode('root', this.scene)
        const pbr1 = this.matFactory.create(PBREnum.Metal_Plate_15,
            { pScale: 0.01, uScale: 20, vScale: 20 });
        const pbr2 = this.matFactory.create(PBREnum.Metal_Plate_41,
            { uScale: 2 * WALL_WIDTH / WALL_HEIGHT, vScale: 2 })

        // Create lighting
        const hemLight = new HemisphericLight('hemLight', Vector3.Up(), this.scene)
        hemLight.groundColor = new Color3(36 / 255, 40 / 255, 60 / 255)
        hemLight.diffuse = new Color3(235 / 255, 225 / 255, 250 / 255)
        hemLight.specular = Color3.White()
        hemLight.intensity = 0.4
        this.createPointLight(new Vector3(-25, 10, -25), root)
        this.createPointLight(new Vector3(-25, 10, 25), root)
        this.createPointLight(new Vector3(25, 10, 0), root)

        // Create walls
        const wall1 = MeshBuilder.CreatePlane('wall1',
            { height: WALL_HEIGHT, width: WALL_WIDTH })
        wall1.material = pbr2
        wall1.parent = root
        wall1.position = new Vector3(0, WALL_HEIGHT / 2, 50)
        wall1.rotation = Vector3.Zero()
        wall1.freezeWorldMatrix()
        const wall2 = wall1.createInstance('wall2')
        wall2.parent = root
        wall2.position.x = 50
        wall2.position.z = 0
        wall2.rotation.y = Math.PI / 2
        wall2.freezeWorldMatrix()
        const wall3 = wall1.createInstance('wall3')
        wall3.parent = root
        wall3.position.x = 0
        wall3.position.z = -50
        wall3.rotation.y = Math.PI
        wall3.freezeWorldMatrix()
        const wall4 = wall1.createInstance('wall4')
        wall4.parent = root
        wall4.position.x = -50
        wall4.position.z = 0
        wall4.rotation.y = 3 * Math.PI / 2
        wall4.freezeWorldMatrix()

        wall1.physicsImpostor = new PhysicsImpostor(wall1, PhysicsImpostor.BoxImpostor, {
            mass: 0, restitution: 0.4,
        }, this.scene)
        wall2.physicsImpostor = new PhysicsImpostor(wall2, PhysicsImpostor.BoxImpostor, {
            mass: 0, restitution: 0.4,
        }, this.scene)
        wall3.physicsImpostor = new PhysicsImpostor(wall3, PhysicsImpostor.BoxImpostor, {
            mass: 0, restitution: 0.4,
        }, this.scene)
        wall4.physicsImpostor = new PhysicsImpostor(wall4, PhysicsImpostor.BoxImpostor, {
            mass: 0, restitution: 0.4,
        }, this.scene)

        // Create ground
        const ground1 = Mesh.CreateGround('ground1', 100, 100, 1, this.scene)
        ground1.material = pbr1
        ground1.position = new Vector3(0, 0, 0)
        ground1.freezeWorldMatrix()
        ground1.physicsImpostor = new PhysicsImpostor(ground1, PhysicsImpostor.BoxImpostor, {
            mass: 0, restitution: 0.4, friction: 1
        }, this.scene)
    }

    private createPointLight = (position: Vector3, parent: TransformNode) => {
        const light = new PointLight('light', position, this.scene)
        light.diffuse = Color3.White()
        light.specular = Color3.White()
        light.intensity = 20
        light.parent = parent
        return light
    }
}
