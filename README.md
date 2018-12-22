hass.io ruuvitag addon
======================

> :point_right: If you are not using Hass.io, you may want to look at [Ruuvidriver](https://github.com/akx/ruuvidriver) instead.

This [Hass.io](https://www.home-assistant.io/hassio/) platform addon reads data from [RuuviTag](https://ruuvi.com/) weather station BLE tags and posts it to your Home Assistant instance.

Compatibility
-------------

Tested on a Hass.io 141 / HassOS 1.13 / Home Assistant 0.84.6 installation on a Raspberry Pi 3. Your mileage will vary.

Installation
------------

Since it's pretty beta right now, probably the easiest way is to `git clone` this repository to your Hass.io box's local addons directory, then install as a local addon.

The build process will take several minutes, so please be patient!

(A future rewrite should probably get rid of the Node.js stuff to make the build tolerable, but `node-ruuvitag` is so conveniently _there_ ...)

Usage
-----

After you've built and started the addon, hit refresh on the addon page's log pane.
The addon will cheerfully inform you about any new tags it's found that aren't configured yet, and tells you how to do just that.

The gist of it is that you'll want your config JSON to look something like this:

```json
{
  "interval": 30,
  "debug": 0,
  "tags": [
    {
      "id": "beefbeefbeef",
      "name": "hallway",
      "enabled": true,
      "temperature": true,
      "pressure": true,
      "humidity": true,
      "battery": true,
      "acceleration": false,
      "accelerationX": false,
      "accelerationY": false,
      "accelerationZ": false
    }
  ]
}
```

This particular sensor is on the wall of my hallway, and I don't expect its acceleration to change that much, so the acceleration flags are disabled. (However, please note that only momentary acceleration at the time the Ruuvitag broadcasts its data is reported.)

The global `interval` is measured in seconds; you can also specify it per-tag should you need to. 

With the configuration written, hit Restart on the addon, and it should no longer report the tag as unconfigured, and you should see `sensor.hallway_temperature`, etc. on your Home Assistant dashboard.

